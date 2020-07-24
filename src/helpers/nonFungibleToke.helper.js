const ethersLib = require('ethers');
const { ethers } = require('../ethers');
const { getWallet, getContractInstance, getContractInstanceWithSigner } = require('../ethers');
const nonFungibleTokenContract = require('../../build/contracts/NFTokenMetadata.json');

const deploy = async privateKey => {
  try {
    const wallet = await getWallet(privateKey);
    console.log({ ethersLib });
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

const mint = async ({ contractAddress, privateKey, to, tokenId }) => {
  const contractInstance = await getInstanceWithSigner(contractAddress, privateKey);
  contractInstance
    .mint(to, tokenId)
    .then(receipt => {
      return receipt;
    })
    .catch(error => {
      console.log('Inside mint: ', error);
      return error;
    });
};

module.exports = { deploy, getInstance, mint };
