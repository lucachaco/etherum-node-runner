const { deploy, mint3 } = require('../helpers/fungibleToken.helper');

const deployFungibleToken = async params => {
  try {
    return deploy(params);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
const mintFungibleToken = async ({ privateKey, contractAddress, tokenId, _uri }) => {
  return mint3({ privateKey, contractAddress, tokenId, _uri });
};

module.exports = { deployFungibleToken, mintFungibleToken };
