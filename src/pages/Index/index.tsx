import React from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import Button from 'components/Button';
import { BiCopy } from 'react-icons/bi';
import { MdOpenInNew } from 'react-icons/md';
import MiddleTruncate from 'components/MiddleTruncate';
import copy from 'copy-to-clipboard';
import { useStore } from 'store';
import { ethers } from 'ethers';
import { ContractApi } from 'apis';
import { IContract, INFT } from 'apis/types';
import Loading from 'components/Loading';
import sleep from 'utils/sleep';

export default observer(() => {
  const { snackbarStore } = useStore();
  const state = useLocalObservable(() => ({
    contracts: [] as IContract[],
    fetched: false,
  }));

  React.useEffect(() => {
    (async () => {
      try {
        state.contracts = await ContractApi.list();
      } catch (err) {
        console.log(err);
      }
      state.fetched = true;
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        const localAddress = localStorage.getItem('metaMaskAddress');
        if (localAddress) {
          const provider = new ethers.providers.Web3Provider((window as any).ethereum);
          const accounts = await provider.send("eth_requestAccounts", []);
          const address = accounts[0];
          if (address !== localAddress) {
            localStorage.setItem('metaMaskAddress', address);
            window.location.reload();
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  if (!state.fetched) {
    return (
      <div className="pt-[30vh] flex justify-center">
        <Loading size={32} />
      </div>
    )
  }

  return (
    <div className="text-[28px] w-[1000px] mx-auto pt-10 text-white/80">
      <div className="text-[46px] font-extrabold text-orange-400 text-center leading-tight">
        Get NFT on Rum chain
      </div>
      {state.contracts.map(contract => (
        <div className="w-[760px] mx-auto mt-10" key={contract.contractAddress}>
          <div className="border border-white/40 rounded-12 bg-gray-88/10">
            <div className="flex items-center justify-between text-white/80 px-6 py-3">
              <div className="text-[28px] font-bold">{contract.contractName}</div>
              <div className="text-12 flex items-end flex-col">
                <div className="flex items-center cursor-pointer" onClick={() => {
                  copy(contract.contractAddress);
                  snackbarStore.show({
                    message: 'Copied',
                  });
                }}>
                  <span className="mr-1 font-bold">Contract</span>
                  <div className="opacity-70">
                    <MiddleTruncate string={contract.contractAddress} length={10} />
                  </div>
                  <BiCopy className="text-14 ml-1 text-orange-400" />
                </div>
                <div className="flex items-center mt-1 cursor-pointer" onClick={() => {
                  window.open(contract.clubUrl);
                }}>
                  <span className="mr-1 font-bold">Club</span>
                  <div className="opacity-70">
                    <MiddleTruncate string={contract.clubUrl} length={15} />
                  </div>
                  <MdOpenInNew className="text-14 ml-1 text-orange-400 opacity-90" />
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-white/40">
              <NFTs contractAddress={contract.contractAddress} />
            </div>
          </div>
        </div>
      ))}
      <div className="pb-20" />
    </div>
  )
});

interface INFTsProps {
  contractAddress: string
}

const NFTs = observer((props: INFTsProps) => {
  const { snackbarStore, confirmDialogStore } = useStore();
  const state = useLocalObservable(() => ({
    address: localStorage.getItem('metaMaskAddress') || '',
    nfts: [] as INFT[],
    fetched: false,
    minting: false
  }));

  React.useEffect(() => {
    (async () => {
      if (state.address) {
        try {
          state.nfts = await ContractApi.listNFTs(props.contractAddress, state.address);
        } catch (err) {
          console.log(err);
        }
      }
      state.fetched = true;
    })();
  }, []);

  const mint = async (contractAddress: string) => {
    if (state.minting) {
      return;
    }
    if (!(window as any).ethereum) {
      confirmDialogStore.show({
        content: 'Please install MetaMask first',
        cancelText: 'Got it',
        okText: 'Install',
        ok: () => {
          confirmDialogStore.okText = 'Redirecting';
          confirmDialogStore.setLoading(true);
          window.location.href = 'https://metamask.io';
        },
      });
      return;
    }
    if (state.nfts.length >= 3) {
      snackbarStore.show({
        message: 'Each account can get 3 NFTs at most',
        type: 'error',
        duration: 3000
      });
      return;
    }
    state.minting = true;
    try {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      localStorage.setItem('metaMaskAddress', address);
      console.log(`[address]:`, accounts[0]);
      await ContractApi.mint(contractAddress, address);
      snackbarStore.show({
        message: 'Done',
      });
      await sleep(1000);
      window.location.reload();
    } catch (err) {
      console.log(err);
      snackbarStore.show({
        message: 'Something wrong',
        type: 'error',
      });
    }
    state.minting = false;
  }

  if (!state.fetched) {
    return (
      <div className="py-8 flex justify-center">
        <Loading size={24} />
      </div>
    )
  }

  return (
    <div>
      {state.nfts.length > 0 && (
        <div>
          <div className="font-bold text-20 opacity-70 text-center">My NFTs 👇👇👇</div>
          <div className="flex flex-wrap px-5 justify-center pt-2 pb-4">
            {state.nfts.map(nft => (
              <img key={nft.tokenId} src={nft.image} alt={`${nft.tokenId}`} className="w-[200px] m-2 rounded-12" />
            ))}
          </div>
        </div>
      )}
      <div className={`flex justify-center ${state.nfts.length === 0 ? 'py-8' : 'py-3'}`}>
        <Button
          size="small"
          onClick={() => mint(props.contractAddress)}
          isDoing={state.minting}
        >
          <span className="font-bold px-2 tracking-wider text-16">Git me an NFT</span>
        </Button>
      </div>
    </div>
  )
});