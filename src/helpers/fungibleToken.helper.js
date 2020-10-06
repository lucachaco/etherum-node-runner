const ethersLib = require('ethers');
const fungibleTokenContract = require('../../build/contracts/FET.json');
const {
  getContractInstance,
  getSignedTx,
  getProviderResolver,
  getWallet,
  getUnsignedContractDeployment,
} = require('../ethers');

const deploy = async ({ privateKey, name, symbol, initialAccountAddress, initialBalance }) => {
  try {
    const wallet = await getWallet(privateKey);
    const factory = new ethersLib.ContractFactory(
      fungibleTokenContract.abi,
      fungibleTokenContract.bytecode,
      wallet,
    );
    const factoryDeployContract = await factory.deploy(
      name,
      symbol,
      0,
      initialAccountAddress,
      initialBalance,
    );
    return factoryDeployContract.deployed();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const deploy3 = async ({ privateKey, name, symbol, initialAccountAddress, initialBalance }) => {
  try {
    const tx = getUnsignedContractDeployment(fungibleTokenContract, [
      name,
      symbol,
      0,
      initialAccountAddress,
      initialBalance,
    ]);

    const signedTransaction = await getSignedTx(
      { data: tx, to: '', gasPrice: 1, gasLimit: '0x4c4b40' },
      privateKey,
    );
    const provider = await getProviderResolver();
    const sentTransaction = await provider.sendTransaction(signedTransaction);
    return sentTransaction.wait();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getInstance = async contractAddress => {
  return getContractInstance(fungibleTokenContract.abi, contractAddress);
};

module.exports = { deploy, deploy3, getInstance };
