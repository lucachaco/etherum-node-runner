const { deploy, mint } = require('../helpers/nonFungibleToken.helper');

const deployNonFungibleToken = async ({ privateKey }) => {
  try {
    return await deploy(privateKey);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
const mintNonFungibleToken = async ({
  privateKey,
  account,
  contractAddress,
  tokenId,
  _uri,
  fungibleTokenContractAddress,
}) => {
  return mint({
    privateKey,
    account,
    contractAddress,
    tokenId,
    _uri,
    fungibleTokenContractAddress,
  });
};

module.exports = { deployNonFungibleToken, mintNonFungibleToken };
