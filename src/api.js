const Semaphore = require('await-semaphore');

const express = require('express');
const ethers = require('./ethers');
const {
  deployNonFungibleToken,
  mintNonFungibleToken,
} = require('./services/nonFungibleToken.service');

const { deployFungibleToken } = require('./services/fungibleToken.service');

const semaphore = new Semaphore.Semaphore(3);

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

api.get('/health-check-2', async (req, res) => {
  console.log({ protocol: req.protocol, host: req.get('host'), originalUrl: req.originalUrl });
  return res.json({ done: true });
});

const account = '0x0c1c28336f5f256bd6657215f00ee83121e51336';
const privateKey = '0x6406dee0024f4153023622b2cb85bb6a1a215e245e071dbfd801070814339644';
let deployFungibleTokenResponse;
let deployNonFungibleTokenResponse;
let fungibleTokenContractAddress;
// eslint-disable-next-line no-underscore-dangle
const _uri = '00';

api.post('/deploy', async (req, res) => {
  deployFungibleTokenResponse = await deployFungibleToken({
    privateKey,
    name: 'My Contract',
    symbol: 'BCA',
    initialAccountAddress: account,
    initialBalance: 9000000000,
  });
  fungibleTokenContractAddress = deployFungibleTokenResponse.contractAddress;
  deployNonFungibleTokenResponse = await deployNonFungibleToken({ privateKey });
  // console.log({ deployFungibleTokenResponse, deployNonFungibleTokenResponse });
  return res.json({ ft: deployFungibleTokenResponse, nft: deployNonFungibleTokenResponse });
});

api.post('/mint', async (req, res) => {
  const tokenId = Date.now() % 1000000;
  const mintNonFungibleTokenReceipt = await mintNonFungibleToken({
    privateKey,
    contractAddress: deployNonFungibleTokenResponse.contractAddress,
    account,
    tokenId,
    _uri,
    fungibleTokenContractAddress,
  });
  return res.json({ receipt: mintNonFungibleTokenReceipt });
});

api.post('/run', async (req, res) => {
  deployFungibleTokenResponse = await deployFungibleToken({
    privateKey,
    name: 'My Contract',
    symbol: 'BCA',
    initialAccountAddress: account,
    initialBalance: 9000000000,
  });
  fungibleTokenContractAddress = deployFungibleTokenResponse.contractAddress;
  deployNonFungibleTokenResponse = await deployNonFungibleToken({ privateKey });
  const mintPromises = [];
  for (let i = 0; i < 10; i += 1) {
    const release = await semaphore.acquire();
    mintPromises.push(
      mintNonFungibleToken({
        privateKey,
        contractAddress: deployNonFungibleTokenResponse.address,
        account,
        tokenId: i,
        _uri,
        fungibleTokenContractAddress,
      }),
    );
    release();
  }
  const results = await Promise.all(mintPromises);
  return res.json({ data: results });
});

api.listen(port, () => console.log(`Example app listening on port ${port}!`));
