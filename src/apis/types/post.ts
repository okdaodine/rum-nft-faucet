import { TrxStorage } from '../common';

export interface IPost {
  trxId: string
  id: string
  content: string
  userAddress: string
  timestamp: number
  storage?: TrxStorage
}
