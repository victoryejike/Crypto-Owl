import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { ToastType } from '@type/enums';
import toast from '@util/toast';
import i18n from '@util/i18n';
import { Contract } from 'web3-eth-contract';
import store from '@/store';

const $t = i18n.global.t;

const { ethereum }: any = window;
const web3 = new Web3(ethereum);

export default {
  /*
   * Check whether the user installed or enable the broswer wallet or not.
   * Note: if the wallet only locked, the function will return true.
   */
  async isMetaMaskInstalled(): Promise<boolean> {
    return new Promise((resolve) => {
      const tid = setInterval(() => {
        // window.ethereum is undefined if document state is not complete
        if (document.readyState === 'complete') {
          clearInterval(tid);
          const result = ethereum && ethereum.isMetaMask;
          if (!result) {
            toast({
              title: $t('metamask.toast.no_metamask_title'),
              description: $t('metamask.toast.no_metamask_des'),
              type: ToastType.FAILED,
            });
          }
          resolve(result);
        }
      }, 200);
    });
  },

  /*
   * Return the first wallet address in the Metamask.
   */
  async getActiveAddress(): Promise<string> {
    let result = null;
    try {
      [result] = await ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      if (error.code === -32002) {
        toast({
          title: $t('metamask.toast.pending_title'),
          description: $t('metamask.toast.pending_des'),
          type: ToastType.FAILED,
        });
      }
    }
    return result;
  },

  /*
   * Initial a contract object with ABI and contract address in order to interact with the contract.
   */
  initContract(abi: AbiItem | AbiItem[], address: string | undefined): Contract | undefined {
    let contract;
    try {
      contract = new web3.eth.Contract(abi, address);
    } catch (error) {
      console.error(error);
      toast({
        title: $t('metamask.toast.unexcepted_title'),
        description: $t('metamask.toast.unexcepted_des'),
        type: ToastType.FAILED,
      });
    }
    return contract;
  },

  /*
   * Monitoring user's active chain, it use to show alert when user change to a wrong chain.
   * So it should be called at the very first. Return false if user does not install / enable Metamask.
   */
  async detectingChain(): Promise<boolean> {
    if (await this.isMetaMaskInstalled()) {
      // Since the observer will not trigger when the user visit the site, so we have to check it
      store.commit('data/setIsWrongChain', ethereum?.chainId !== process.env.VUE_APP_ETH_CHAIN_ID);
      // Prevent creating multiple observer
      if (!store.getters['data/isMonitoringChain']) {
        store.commit('data/setIsMonitoringChain', true);
        ethereum.on('chainChanged', (chainId: string) => {
          store.commit('data/setIsWrongChain', chainId !== process.env.VUE_APP_ETH_CHAIN_ID);
        });
      }
      return true;
    }
    return false;
  },

  /*
   * Monitoring user's active account. Return false if user does not install / enable Metamask.
   */
  async detectingAccount(): Promise<boolean> {
    if (await this.isMetaMaskInstalled()) {
      // Prevent creating multiple observer
      if (!store.getters['data/isMonitoringAccount']) {
        store.commit('data/setIsMonitoringAccount', true);
        ethereum.on('accountsChanged', (accounts: string[]) => {
          store.commit('data/setIsAccountLocked', accounts.length === 0);
          store.commit('data/setActiveAddress', accounts[0] || null);
        });
      }
      return true;
    }
    return false;
  },

  /*
   * Auto connect user account if the user already connected before.
   * Return false if user does not install / enable Metamask.
   */
  async initAccount(): Promise<boolean> {
    if (await this.isMetaMaskInstalled()) {
      store.commit('data/setIsAccountLocked', ethereum.selectedAddress == null);
      if (ethereum.selectedAddress) {
        store.commit('data/setActiveAddress', ethereum.selectedAddress);
        this.detectingAccount();
      }
      return true;
    }
    return false;
  },
};
