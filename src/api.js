const express = require('express');
const ethers = require('./ethers');
const {
  deployNonFungibleToken,
  mintNonFungibleToken,
} = require('./services/nonFungibleCommitment.service');

const api = express();
const port = 3001;
ethers.connect();

api.get('/health-check', async (req, res) => {
  const privateKey = '0x13269d5825c0bc3530a41ea575bb114e5a036d38e4d8eff6ea40eb1e6db5b212';

  const tokenId = 2;
  // eslint-disable-next-line no-underscore-dangle
  const _uri = '';

  const deployNonFungibleTokenResponse = await deployNonFungibleToken({ privateKey });
  for (let i = 0; i < 1000; i += 1) {
    const mintNonFungibleTokenResponse = await mintNonFungibleToken({
      privateKey,
      contractAddress: deployNonFungibleTokenResponse.address,
      tokenId,
      _uri,
    });
    console.log(`Hash ${i}: ${mintNonFungibleTokenResponse.hash}`);
  }

  return res.send('Finished!');
});

api.listen(port, () => console.log(`Example app listening on port ${port}!`));
