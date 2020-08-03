const { deploy, deploy2, deploy3, mint, mint2, mint3 } = require('../helpers/nonFungibleToken.helper');

const deployNonFungibleToken = async ({ privateKey }) => {
  try {
    return await deploy3(privateKey);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const mintNonFungibleToken = async ({ privateKey, contractAddress, tokenId, _uri }) => {
  const mintResult = await mint3({ privateKey, contractAddress, tokenId, _uri });
  return mintResult;
};

module.exports = { deployNonFungibleToken, mintNonFungibleToken };
