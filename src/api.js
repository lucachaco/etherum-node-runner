const express = require('express');
const ethers = require('./ethers');
const {
  deployNonFungibleToken,
  mintNonFungibleToken,
} = require('./services/nonFungibleToken.service');

const { deployFungibleToken } = require('./services/fungibleToken.service');

const api = express();
const port = 3001;
ethers.connect();

api.get('/health-check', async (req, res) => {
  const account = '0x6492F786fe85965dcE81a7EEcBf945274a96Af67';
  const privateKey = '0x13269d5825c0bc3530a41ea575bb114e5a036d38e4d8eff6ea40eb1e6db5b212';
  // const privateKey = '0xf0fada4070ce6946aac687b913f0508094f0b2e4327fe69f2ad5cec949995879';
  const deployFungibleTokenResponse = await deployFungibleToken({
    privateKey,
    name: 'name',
    symbol: 'symbol',
    initialAccountAddress: account,
    initialBalance: 9000000000,
  });

  console.log({ deployFungibleTokenResponse });
  const fungibleTokenContractAddress = deployFungibleTokenResponse.contractAddress;

  // const tokenId = 2;
  // eslint-disable-next-line no-underscore-dangle
  const _uri = '00';

  const deployNonFungibleTokenResponse = await deployNonFungibleToken({ privateKey });

  console.log({ deployNonFungibleTokenResponse });

  for (let i = 0; i < 500; i += 1) {
    const mintNonFungibleTokenReceipt = await mintNonFungibleToken({
      privateKey,
      contractAddress: deployNonFungibleTokenResponse.contractAddress,
      account,
      tokenId: i,
      _uri,
      fungibleTokenContractAddress,
    });
    console.log(`Receipt mint: ${i}`, mintNonFungibleTokenReceipt);
  }

  return res.send('Finished!');
});

api.listen(port, () => console.log(`Example app listening on port ${port}!`));
