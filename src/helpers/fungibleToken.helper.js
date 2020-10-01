// const detContract = require('../../build/contracts/DET.json');
const { utf8ToHex } = require('dapp-utils');

const ethersLib = require('ethers');
const config = require('../config');
const fungibleTokenContract = require('../../build/contracts/FET.json');
const {
  getContractInstance,
  getSignedTx,
  getContractInstanceWithSigner,
  getProviderResolver,
  getWallet,
  getUnsignedContractDeployment,
  getBalance,
} = require('../ethers');

const nonFungibleTokenContract = require('../../build/contracts/NFTokenMetadata.json');

const deploy = async ({ privateKey, name, symbol, initialAccountAddress, initialBalance }) => {
  try {
    // const balance = await getBalance(privateKey);
    // console.log({ balance });

    // const tx = await getUnsignedContractDeployment(detContract);
    const tx = getUnsignedContractDeployment(fungibleTokenContract, [
      name,
      symbol,
      0,
      initialAccountAddress,
      initialBalance,
    ]);

    const signedTransaction = await getSignedTx(
      { data: tx, to: '', gasPrice: 1, gasLimit: config.GAS_LIMIT_DEPLOY },
      privateKey,
    );
    const provider = await getProviderResolver();
    const sentTransaction = await provider.sendTransaction(signedTransaction);
    // const receipt = await provider.getTransactionReceipt(sentTransaction.hash);
    const receipt = await sentTransaction.wait();
    return receipt;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getInstance = async contractAddress => {
  const instance = await getContractInstance(nonFungibleTokenContract.abi, contractAddress);
  return instance;
};

module.exports = { deploy, getInstance };
