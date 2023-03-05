import request from 'request';
import { API_BASE_URL } from './common';
import { IContract, INFT } from './types';

export default {
  async list() {
    const contracts: IContract[] = await request(`${API_BASE_URL}/contracts`);
    return contracts;
  },
  async listNFTs(contractAddress: string, userAddress: string) {
    const NFTs: INFT[] = await request(`${API_BASE_URL}/contracts/${contractAddress}/${userAddress}`);
    return NFTs;
  },
  async mint(contractAddress: string, userAddress: string) {
    const ret: boolean = await request(`${API_BASE_URL}/contracts/${contractAddress}/${userAddress}`, {
      method: 'POST'
    });
    return ret;
  }
}