import { ethers } from 'ethers';
import retry from 'retry';
import Web3 from './web3';

let etherjsProvider;
/**
 * Connects to Blockchain and then sets proper handlers for events
 */
export const connect = () => {
  console.log('Blockchain Connecting ...');
  try {
    Web3.connect();
  } catch (e) {
    console.log('Error while connecting to Blockchain with Web3');
  }

  try {
    const connectionInfo = { url: config.RPC_PROVIDER, timeout: 3000000 };
    etherjsProvider = new ethers.providers.JsonRpcProvider(connectionInfo, 'unspecified');
  } catch (e) {
    logger.log({
      level: 'error',
      message: 'Error while connecting to the provider: '.concat(e),
    });
  }

  const handleError = err => {
    console.error('Blockchain Error ...', err);
    console.log('Reconnecting to RPC ...');
    connect();
    // throw err;
  };

  etherjsProvider.on('error', handleError);
  etherjsProvider.getBlockNumber().then(blockNumber => {
    console.log(`Blockchain connected to geth node. Current block number: ${blockNumber}`);
  });
  etherjsProvider.listAccounts().then(accounts => {
    console.log('Accounts list', accounts);
  });
};

/**
 * Returns the default provider.
 */
export const getProvider = () => {
  const promise = new Promise(resolve => {
    if (etherjsProvider !== undefined) {
      etherjsProvider
        .getBlockNumber()
        .then(blockNumber => {
          console.log(`Blockchain connected to geth node. Current block number: ${blockNumber}`);
          resolve(etherjsProvider);
        })
        .catch(error => {
          console.log('Error while connecting to geth node: ', error);
          try {
            connect();
          } catch (err) {
            console.log('Error while creating new provider: ', err);
          }
          resolve(etherjsProvider);
        });
    }
  });
  return promise;
};

const faultToleranceGetProvider = cb => {
  const operation = retry.operation(config.RETRY_OPTIONS);
  operation.attempt(currentAttempt => {
    logger.log({
      level: 'info',
      message: `Get Ethers.js Provider | Attempt: ${currentAttempt}`,
    });
    return new Promise((resolve, reject) => {
      try {
        const provider = getProvider();
        resolve(cb(provider.error ? operation.mainError() : null, provider));
      } catch (error) {
        logger.log({
          level: 'error',
          message: 'Error while getting Ethers.js Provider: '.concat(error),
        });
        operation.retry(error);
        reject(error);
      }
    });
  });
};

export const getProviderResolver = async () => {
  return new Promise((resolve, reject) => {
    faultToleranceGetProvider(async (err, provider) => {
      if (err) {
        console.log('Error in Get Provider Resolver:', err);
        reject(err);
      }
      resolve(provider);
    });
  });
};

/**
 * Returns a wallet using the given private key. The default key is privatekey using the default ganache seed.
 * @param {*} privateKey
 */
export const getWallet = async privateKey => {
  const provider = await getProviderResolver();
  let wallet = null;
  try {
    wallet = new ethers.Wallet(privateKey, provider);
  } catch (e) {
    console.log('Failed to initialize Wallet', e);
  }
  return wallet;
};

/**
 * Gets the existing contract of a given type on the network.
 *
 * @param {String} contractName - name of contract
 * @param {String} contractAddress - address of the contract
 * @throws {ReferenceError} If contract doesn't exist, throws an exception.
 * @return {ethers.Contract} Returns contract object.
 */
export const getContract = async (contractName, contractAddress) => {
  try {
    const contractJson = jsonfile.readFileSync(
      path.join(__dirname, './contracts/', `${contractName}.json`),
    );
    const provider = getProvider();
    return new ethers.Contract(contractAddress, contractJson.abi, provider);
  } catch (e) {
    throw new Error(`Failed to instantiate compiled contract ${contractName}`);
  }
};

/**
 * Gets the existing contract of a given type on the network.
 * @param {String} contractName - name of contract
 * @param contractAddress
 * @param {String} privateKey - signer address
 * @returns {Promise<Contract>}
 * @throws {ReferenceError} If contract doesn't exist, throws an exception.
 */

export const getContractWithSigner = async (contractName, contractAddress, privateKey) => {
  try {
    const contractJson = jsonfile.readFileSync(
      path.join(__dirname, './contracts/', `${contractName}.json`),
    );

    const provider = getProvider();
    const contract = new ethers.Contract(contractAddress, contractJson.abi, provider);
    const wallet = await getWallet(privateKey);
    return contract.connect(wallet);
  } catch (e) {
    throw new Error(`Failed to instantiate compiled contract ${contractName}`);
  }
};

const faultTolerantGetInstance = (contractAddress, contractABI, provider, cb) => {
  const operation = retry.operation(config.RETRY_OPTIONS);
  operation.attempt(currentAttempt => {
    logger.log({
      level: 'info',
      message: `Get instance attempt: ${currentAttempt}`,
    });
    return new Promise((resolve, reject) => {
      try {
        const instance = new ethers.Contract(contractAddress, contractABI, provider);
        resolve(cb(instance.error ? operation.mainError() : null, instance));
      } catch (error) {
        logger.log({
          level: 'error',
          message: 'Error while getting the instance: '.concat(error),
        });
        operation.retry(error);
        reject(error);
      }
    });
  });
};

export const getContractInstance = async (contractABI, contractAddress) => {
  try {
    const provider = await getProviderResolver();
    return new Promise((resolve, reject) => {
      faultTolerantGetInstance(contractAddress, contractABI, provider, async (err, instance) => {
        if (err) {
          console.log('Error in faultTolerantGetInstance:', err);
          reject(err);
        }
        resolve(instance);
      });
    });
  } catch (e) {
    throw new Error('Failed to instantiate');
  }
};

export const getContractInstanceWithSigner = async (contractABI, contractAddress, privateKey) => {
  try {
    const provider = await getProviderResolver();
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const wallet = await getWallet(privateKey);
    return contract.connect(wallet);
  } catch (e) {
    throw new Error(`Failed to instantiate compiled contract ${contractAddress}`);
  }
};
