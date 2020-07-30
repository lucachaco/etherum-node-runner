const ethersLib = require('ethers');
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

const deploy = async privateKey => {
  try {
    const wallet = await getWallet(privateKey);
    const factory = new ethersLib.ContractFactory(
      nonFungibleTokenContract.abi,
      nonFungibleTokenContract.bytecode,
      wallet,
    );
    const factoryDeployContract = await factory.deploy();
    const deployedContract = await factoryDeployContract.deployed();
    return deployedContract;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const deploy2 = async privateKey => {
  try {
    const balance = await getBalance(privateKey);
    console.log({ balance });

    const tx = await getUnsignedContractDeployment(nonFungibleTokenContract);
    /* console.log({ tx }); */
    /* const contractInstance = await getContractInstance(
      nonFungibleTokenContract.abi,
      contractAddress,
    ); */
    // console.log('mint: ', JSON.stringify(contractInstance.interface.functions));
    // const tx = await contractInstance.interface.functions.mint.encode([tokenId, _uri]);

    const signedTransaction = await getSignedTx(
      { data: tx, to: '', gasPrice: 1, gasLimit: 2000000 },
      privateKey,
    );
    const provider = await getProviderResolver();
    const sentTransaction = await provider.sendTransaction(signedTransaction);
    //console.log({ sentTransaction });

    const receipt = await provider.getTransactionReceipt(sentTransaction.hash);
    //console.log({ receipt });
    return receipt;
    // const receipt = await getTransactionReceipt(provider, transaction.transactionHash);

    /*
    const wallet = await getWallet(privateKey);
    const factory = new ethersLib.ContractFactory(
      nonFungibleTokenContract.abi,
      nonFungibleTokenContract.bytecode,
      wallet,
    );
    const factoryDeployContract = await factory.deploy();
    const deployedContract = await factoryDeployContract.deployed();
    return deployedContract; */
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getInstance = async contractAddress => {
  const instance = await getContractInstance(nonFungibleTokenContract.abi, contractAddress);
  return instance;
};

const getInstanceWithSigner = async (contractAddress, privateKey) => {
  const instance = await getContractInstanceWithSigner(
    nonFungibleTokenContract.abi,
    contractAddress,
    privateKey,
  );
  return instance;
};

const mint = async ({ privateKey, contractAddress, tokenId, _uri }) => {
  const contractInstance = await getInstanceWithSigner(contractAddress, privateKey);
  const overrides = {
    gasLimit: 750000,
  };
  const mintResponse = await contractInstance.mint(tokenId, _uri, overrides);
  return mintResponse;
};

const mint2 = async ({ privateKey, contractAddress, tokenId, _uri }) => {
  const contractInstance = await getContractInstance(nonFungibleTokenContract.abi, contractAddress);
  const tx = await contractInstance.interface.functions.mint.encode([tokenId, _uri]);
  const balance = await getBalance(privateKey);
  console.log({ balance });
  const signedTransaction = await getSignedTx(
    { data: tx, to: '', gasPrice: 1, gasLimit: '0x4c4b40' },
    privateKey,
  );
  const provider = await getProviderResolver();
  const sentTransaction = await provider.sendTransaction(signedTransaction);

  return provider.getTransactionReceipt(sentTransaction.hash);
};

module.exports = { deploy, deploy2, getInstance, mint, mint2 };
