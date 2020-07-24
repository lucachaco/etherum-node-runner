const express = require('express');
const ethers = require('./ethers');
const nonFungibleCommitmentService = require('./services/nonFungibleCommitment.service');

const api = express();
const port = 3001;
ethers.connect();

api.get('/health-check', async (req, res) => {
  const privateKey = '0x13269d5825c0bc3530a41ea575bb114e5a036d38e4d8eff6ea40eb1e6db5b212';

  const response = await nonFungibleCommitmentService.deployNonFungibleToken({ privateKey });
  return res.send('Ok.');
});

api.listen(port, () => console.log(`Example app listening on port ${port}!`));
