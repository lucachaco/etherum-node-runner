import { ethers } from 'ethers/index';
import { getWallet, getContractInstance, getContractInstanceWithSigner } from '../ethers';
import nonFungibleTokenContract from '../contracts/DET.json';

const deploy = async privateKey => {
  try {
    const wallet = await getWallet(privateKey);
    const factory = new ethers.ContractFactory(
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

export { deploy, getInstance, mint };
