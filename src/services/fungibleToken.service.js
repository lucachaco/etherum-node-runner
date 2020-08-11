const {
  deploy3,
  mint3,
} = require('../helpers/fungibleToken.helper');

const deployFungibleToken = async (params) => {
  try {
    return await deploy3(params);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
const mintFungibleToken = async ({ privateKey, contractAddress, tokenId, _uri }) => {
  const mintResult = await mint3({ privateKey, contractAddress, tokenId, _uri });
  return mintResult;
};

module.exports = { deployFungibleToken, mintFungibleToken };
