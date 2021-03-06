const { utf8ToHex } = require('dapp-utils');
const ethersLib = require('ethers');
const config = require('../config');
const {
  getContractInstance,
  getSignedTx,
  getContractInstanceWithSigner,
  getProviderResolver,
  getWallet,
  getUnsignedContractDeployment,
  getBalance,
} = require('../ethers');
const detContract = require('../../build/contracts/DET.json');

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

    const signedTransaction = await getSignedTx(
      { data: tx, to: '', gasPrice: 1, gasLimit: '0x4c4b40' },
      privateKey,
    );
    const provider = await getProviderResolver();
    const sentTransaction = await provider.sendTransaction(signedTransaction);
    const receipt = await sentTransaction.wait();
    return receipt;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const deploy3 = async privateKey => {
  try {
    // const balance = await getBalance(privateKey);
    // console.log({ balance });

    const tx = await getUnsignedContractDeployment(detContract);

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
  const signedTransaction = await getSignedTx(
    { data: tx, to: contractAddress, gasPrice: 1, gasLimit: '0x4c4b40' },
    privateKey,
  );
  const provider = await getProviderResolver();

  const sentTransaction = await provider.sendTransaction(signedTransaction);
  const gasEstimation = await provider.estimateGas(signedTransaction);

  // await new Promise(r => setTimeout(r, 2000));

  const receipt = await sentTransaction.wait();

  // return provider.getTransactionReceipt(sentTransaction.hash);
  return receipt;
};

const getError = async hash => {
  const provider = await getProviderResolver();

  const tx = await provider.getTransaction(hash);

  const code = await provider.call(tx, tx.blockNumber);
  console.log({ code });
};

const createTokenDetails = async (
  to,
  tokenId,
  hashOfCOR,
  fungibleTokenContractAddress,
  responsibleEntityAddress,
) => {
  const opaqueInvestorID = 'I1-197';
  const country = 'Italy';
  const treatyCategoryCode = 'Fund0';
  const securitySymbol = 'Fund';
  const recordDate = '2018-12-15T00:00:00.000Z';
  const dividendEventCode = 'div-contract-2';
  const dateOfPurchase = '2018-12-15T00:00:00.000Z';
  const dateOfSale = '2018-12-15T00:00:00.000Z';
  const liableToTax = 'Y';
  const subjectToTax = 'Y';
  const beneficialOwner = 'Y';
  const permanentEstablishment = 'Y';
  const securitiesPartOfBorrowing = 'Y';
  const trackingID = '2F786fe859';

  const hexFormattedOpaqueInvestorID = utf8ToHex(opaqueInvestorID);
  const hexFormattedCountry = utf8ToHex(country);
  const hexFormattedTreaty = utf8ToHex(treatyCategoryCode);
  const hexFormattedSecuritySymbol = utf8ToHex(securitySymbol);
  const hexFormattedRecordDate = utf8ToHex(recordDate);
  const hexFormattedDividendEventCode = utf8ToHex(dividendEventCode);
  const hexFormattedDateOfPurchase = utf8ToHex(dateOfPurchase);
  const hexFormattedDateOfSale = utf8ToHex(dateOfSale);
  const hexFormattedLiableToTax = utf8ToHex(liableToTax);
  const hexFormattedSubjectToTax = utf8ToHex(subjectToTax);
  const hexFormattedBeneficialOwner = utf8ToHex(beneficialOwner);
  const hexFormattedPermanentEstablishment = utf8ToHex(permanentEstablishment);
  const hexFormattedSecuritiesPartOfBorrowing = utf8ToHex(securitiesPartOfBorrowing);
  const hexFormattedTrackingID = utf8ToHex(trackingID);

  const tokenByteValues = [];
  tokenByteValues.push(hexFormattedOpaqueInvestorID);
  tokenByteValues.push(hexFormattedCountry);
  tokenByteValues.push(hexFormattedTreaty);
  tokenByteValues.push(hexFormattedSecuritySymbol);
  tokenByteValues.push(hexFormattedRecordDate);
  tokenByteValues.push(hexFormattedDividendEventCode);
  tokenByteValues.push(hexFormattedDateOfPurchase);
  tokenByteValues.push(hexFormattedDateOfSale);
  tokenByteValues.push(hexFormattedTrackingID);

  const tokenQuestionsValues = [];
  tokenQuestionsValues.push(hexFormattedLiableToTax.substring(0, 4));
  tokenQuestionsValues.push(hexFormattedSubjectToTax.substring(0, 4));
  tokenQuestionsValues.push(hexFormattedBeneficialOwner.substring(0, 4));
  tokenQuestionsValues.push(hexFormattedPermanentEstablishment.substring(0, 4));
  tokenQuestionsValues.push(hexFormattedSecuritiesPartOfBorrowing.substring(0, 4));

  const dividendPerShare = 3;
  const amount = 4000;
  const wht = 400;
  const tokenNumbers = [];
  const previousTokenId = 3;
  tokenNumbers.push(dividendPerShare);
  tokenNumbers.push(amount);
  tokenNumbers.push(wht);
  tokenNumbers.push(previousTokenId);

  return {
    to,
    tokenId,
    hashOfCOR,
    tokenByteValues,
    tokenQuestionsValues,
    tokenNumbers,
    fungibleTokenContractAddress,
    responsibleEntityAddress,
  };
};

const mint3 = async ({
  privateKey,
  account,
  contractAddress,
  tokenId,
  fungibleTokenContractAddress,
}) => {
  const contractInstance = await getContractInstance(detContract.abi, contractAddress);

  const to = contractAddress;
  const responsibleEntityAddress = contractAddress;
  const hashOfCOR = '';

  const tokenDetails = await createTokenDetails({
    to,
    tokenId,
    hashOfCOR,
    fungibleTokenContractAddress,
    responsibleEntityAddress,
  });

  const { tokenByteValues } = tokenDetails;
  const { tokenQuestionsValues } = tokenDetails;
  const { tokenNumbers } = tokenDetails;
  const tx = await contractInstance.interface.functions.mint.encode([
    account,
    tokenId,
    hashOfCOR,
    tokenByteValues,
    tokenQuestionsValues,
    tokenNumbers,
    fungibleTokenContractAddress,
    responsibleEntityAddress,
  ]);

  const signedTransaction = await getSignedTx(
    { data: tx, to: contractAddress, gasPrice: 1, gasLimit: config.GAS_LIMIT_MINT },
    privateKey,
  );
  const provider = await getProviderResolver();

  const gasEstimation = await provider.estimateGas(signedTransaction);
  console.log({ gasEstimation });
  const sentTransaction = await provider.sendTransaction(signedTransaction);
  const receipt = await sentTransaction.wait();
  // return provider.getTransactionReceipt(sentTransaction.hash);
  return receipt;
};

module.exports = { deploy, deploy2, deploy3, getInstance, mint, mint2, mint3, getError };
