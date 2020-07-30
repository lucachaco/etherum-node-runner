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
  // const privateKey = '0x13269d5825c0bc3530a41ea575bb114e5a036d38e4d8eff6ea40eb1e6db5b212';

  const privateKey = '0xf0fada4070ce6946aac687b913f0508094f0b2e4327fe69f2ad5cec949995879';

  const tokenId = 2;
  // eslint-disable-next-line no-underscore-dangle
  const _uri = '00';

  const deployNonFungibleTokenResponse = await deployNonFungibleToken({ privateKey });

  console.log({ deployNonFungibleTokenResponse });

  for (let i = 0; i < 1000; i += 1) {
    const mintNonFungibleTokenReceipt = await mintNonFungibleToken({
      privateKey,
      contractAddress: deployNonFungibleTokenResponse.contractAddress,
      tokenId,
      _uri,
    });
    console.log(`Receipt ${i}: `, mintNonFungibleTokenReceipt);
  }

  return res.send('Finished!');
});

api.listen(port, () => console.log(`Example app listening on port ${port}!`));
