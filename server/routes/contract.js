const router = require('koa-router')();
const config = require('../config');
const Contract = require('../utils/contract');

router.get('/', get);
router.get('/:contractAddress/:userAddress', getNFTs);
router.post('/:contractAddress/:userAddress', mint);

async function get(ctx) {
  const contracts = await Promise.all(config.contractAddresses.map(async contractAddress => {
    const contractName = await Contract.getContractName(contractAddress);
    return {
      contractAddress,
      contractName
    }
  }));
  ctx.body = contracts;
}

async function getNFTs(ctx) {
  const { contractAddress, userAddress } = ctx.params;
  const count = await Contract.getNFTCount(contractAddress, userAddress);
  if (count > 0) {
    const nfts = await Contract.getNFTs(contractAddress, userAddress, count);
    ctx.body = nfts;
  } else {
    ctx.body = [];
  }
}

async function mint(ctx) {
  const { contractAddress, userAddress } = ctx.params;
  await Contract.mint(config.ownerPrivateKey, contractAddress, userAddress);
  ctx.body = true;
}

module.exports = router;