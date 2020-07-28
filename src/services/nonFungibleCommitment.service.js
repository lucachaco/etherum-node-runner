const { deploy, mint } = require('../helpers/nonFungibleToke.helper');

const deployNonFungibleToken = async ({ privateKey }) => {
  try {
    return await deploy(privateKey);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const mintNonFungibleToken = async ({ privateKey, contractAddress, tokenId, _uri }) => {
  const mintResult = await mint({ privateKey, contractAddress, tokenId, _uri });
  return mintResult;
};

module.exports = { deployNonFungibleToken, mintNonFungibleToken };
