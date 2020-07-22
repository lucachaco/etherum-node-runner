import { deploy, mint } from '../helpers/nonFungibleToke.helper';

const deployNonFungibleToken = async ({ privateKey }) => {
  try {
    return await deploy(privateKey);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const mintNonFungibleToken = async ({
  contractAddress,
  accountAddress,
  tokenDetails,
  authorization,
}) => {
  const mintResult = await mint(contractAddress, accountAddress, tokenDetails, authorization);
  return mintResult;
};

export { deployNonFungibleToken, mintNonFungibleToken };
