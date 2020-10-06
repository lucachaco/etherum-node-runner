const originalFetch = require('isomorphic-fetch');
const fetch = require('fetch-retry')(originalFetch);
const Semaphore = require('await-semaphore');
const express = require('express');
// const axios = require('axios');

const api = express();
const port = 4001;
const semaphore = new Semaphore.Semaphore(3);

const get = async url => {
  const options = {
    method: 'GET',
    retries: parseInt(3, 10),
    retryDelay: parseInt(10000, 10),
    retryOn: ['500', '501', '502', '503', '504'],
  };

  const release = await semaphore.acquire();
  const response = await fetch(url, options);
  release();
  return response;
};

const post = async (
  url,
  bodyData,
  opts = { fetchOnDuplicate: true, put: false, failOnError: true },
) => {
  try {
    const options = {
      method: opts.put ? 'PUT' : 'POST',
      body: JSON.stringify(bodyData),
      retries: parseInt(3, 10),
      retryDelay: parseInt(10000, 10),
      retryOn: ['500', '501', '502', '503', '504'],
    };
    const release = await semaphore.acquire();
    let response = await fetch(url, options);
    // const options = {
    //   method: 'POST',
    //   url,
    //   data: bodyData,
    // };
    // let response = await axios.request(options);
    release();

    if (opts.fetchOnDuplicate && response.status === 409 && response.headers.get('location')) {
      response = await get(`http://runner-api${response.headers.get('location')}`);
      console.warn(`Resource already existed: \n${options.method} ${url} \n${options.body}\n`);
      return response;
    }

    if (!response.ok && opts.failOnError) {
      throw new Error(`status code ${response.status} ${JSON.stringify(await response.json())}`);
    }

    return response;
  } catch (err) {
    const errorDetails = {
      url,
      data: JSON.stringify(bodyData),
      errorMessage: err.message,
    };
    throw new Error(JSON.stringify(errorDetails));
  }
};

api.get('/health-check', async (req, res) => {
  res.sendStatus(200);
});

api.post('/run', async (req, res) => {
  const options = {
    method: 'POST',
  };
  await fetch('http://runner-api:3001/deploy', options);
  for (let i = 0; i < 10; i += 1) {
    await post('http://runner-api:3001/mint', { tokenId: i });
  }
  return res.json({ finished: true });
});

api.listen(port, () => console.log(`Seeder App listening on port ${port}!`));
