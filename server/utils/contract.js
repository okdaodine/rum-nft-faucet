const ethers = require('ethers');
const axios = require('axios');
const config = require('../config');

const ERC721_ABI = [
  'constructor(string name, string symbol, string baseTokenURI)',
  'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
  'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)',
  'event Paused(address account)',
  'event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)',
  'event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)',
  'event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'event Unpaused(address account)',
  'function DEFAULT_ADMIN_ROLE() view returns (bytes32)',
  'function MINTER_ROLE() view returns (bytes32)',
  'function PAUSER_ROLE() view returns (bytes32)',
  'function approve(address to, uint256 tokenId)',
  'function balanceOf(address owner) view returns (uint256)',
  'function burn(uint256 tokenId)',
  'function getApproved(uint256 tokenId) view returns (address)',
  'function getRoleAdmin(bytes32 role) view returns (bytes32)',
  'function getRoleMember(bytes32 role, uint256 index) view returns (address)',
  'function getRoleMemberCount(bytes32 role) view returns (uint256)',
  'function grantRole(bytes32 role, address account)',
  'function hasRole(bytes32 role, address account) view returns (bool)',
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
  'function mint(address to)',
  'function name() view returns (string)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function pause()',
  'function paused() view returns (bool)',
  'function renounceRole(bytes32 role, address account)',
  'function revokeRole(bytes32 role, address account)',
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  'function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)',
  'function setApprovalForAll(address operator, bool approved)',
  'function supportsInterface(bytes4 interfaceId) view returns (bool)',
  'function symbol() view returns (string)',
  'function tokenByIndex(uint256 index) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function transferFrom(address from, address to, uint256 tokenId)',
  'function unpause()'
];

const rpc = config.rpc;

const getContractName = async (contractAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
  return await contract.name();
}

const getNFTCount = async (contractAddress, userAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
  const ret = await contract.balanceOf(userAddress);
  const count = parseInt(ethers.utils.formatUnits(ret, 0));
  console.log({ contractAddress, userAddress, count });
  return count;
}

const getNFTs = async (contractAddress, userAddress, count) => {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
  const nfts = await Promise.all(Array(count).fill().map(async (_, index) => {
    try {
      const tokenId = getInt(await contract.tokenOfOwnerByIndex(userAddress, index));
      const tokenURI = await contract.tokenURI(tokenId);
      const fileRes = await axios.get(getFileUrl(tokenURI));
      const image = getFileUrl(fileRes.data.image);
      return { contractAddress, userAddress, image, tokenId }
    } catch (_) {
      return null;
    }
  }));
  return nfts.filter(nft => !!nft);
}

const mint = async (ownerPrivateKey, contractAddress, to) => {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const ownerWallet = new ethers.Wallet(ownerPrivateKey, provider);
  const contractWithSigner = new ethers.Contract(contractAddress, ERC721_ABI, ownerWallet);
  const tx = await contractWithSigner.mint(to);
  await tx.wait();
}

const getFileUrl = (url) => {
  return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
}

const getInt = (bn) => {
  return parseInt(ethers.utils.formatUnits(bn, 0));
}

module.exports = {
  getContractName,
  getNFTCount,
  getNFTs,
  mint,
  ERC721_ABI,
}