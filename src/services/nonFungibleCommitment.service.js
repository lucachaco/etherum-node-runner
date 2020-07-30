const { deploy, deploy2, mint, mint2 } = require('../helpers/nonFungibleToke.helper');

const deployNonFungibleToken = async ({ privateKey }) => {
  try {
    return await deploy2(privateKey);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const mintNonFungibleToken = async ({ privateKey, contractAddress, tokenId, _uri }) => {
  const mintResult = await mint2({ privateKey, contractAddress, tokenId, _uri });
  return mintResult;
};

module.exports = { deployNonFungibleToken, mintNonFungibleToken };
