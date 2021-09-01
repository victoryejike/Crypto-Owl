<template>
  <div class="readmore-container">
    <img
      class="btn-arrow"
      src="@svg/btn-arrow.svg"
    >
    <button
      v-if="mintButton"
      class="btn-mint"
      type="button"
      @click="showQty"
    >
      Click to Mint
    </button>
    <div
      v-else
      class="mintControls"
    >
      <div class="mint-container">
        <h5>How many?</h5>
        <div class="qty-control">
          <button class="qty-add">
            <img
              src="@img/minus-Arrow.png"
              alt="minus"
              @click="minus"
            >
          </button>
          <p class="qty"> x {{ qty }}</p>
          <button class="qty-minus">
            <img
              src="@img/plus-Arrow.png"
              alt="plus"
              @click="add"
            >
          </button>
        </div>
        <p class="price">0.03 ETH per egg</p>
      </div>
      <div class="action">
        <img
          class="confirm-action"
          src="@img/Confirm.png"
          alt="confirm"
          @click="mint(qty)"
        >
        <img
          class="reject-action"
          src="@img/Reject.png"
          alt="reject"
          @click="reject"
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { IReceipt, ITokenMetadata } from '@type/interface';
import axios from '@util/axios';
import {
  computed,
  defineComponent, onMounted, reactive, ref,
} from 'vue';
import { useStore } from 'vuex';
import Web3 from 'web3';
import Metamask from '@/utils/metamask';
import toast from '@/utils/toast';
import { ToastType } from '@/types/enums';
import 'vue-skeletor/dist/vue-skeletor.css';

const ContractABI = require('@/assets/abi/owls-uat.json');

const CONTRACT_ADDRESS = process.env.VUE_APP_CONTRACT_ADDRESS;
const pricePerNFT = 0.03;

export default defineComponent({
  name: 'ReadMore',
  setup() {
    onMounted(() => {
      //
    });
    let closeMsg: () => void | null;
    const contract = Metamask.initContract(ContractABI, CONTRACT_ADDRESS);
    const metadataList = ref<ITokenMetadata[]>([]);
    const store = useStore();
    const activeAddress = computed(() => store.getters['data/activeAddress']);

    const input = reactive({
      amount: 1,
      toAddress: null,
      transferTokenID: null,
      address: null,
      tokenID: null,
    });

    const mintButton = ref(true);
    const qty = ref(1);
    const showQty = () => {
      mintButton.value = false;
    };
    const add = () => {
      qty.value += 1;
    };
    const minus = () => {
      if (qty.value === 1) {
        qty.value = 1;
      } else {
        qty.value -= 1;
      }
    };
    const reject = () => {
      mintButton.value = true;
    };
    const isConnected = () => {
      if (!activeAddress.value) {
        toast({
          title: 'Please connect address first',
          type: ToastType.FAILED,
        });
        return false;
      }
      return true;
    };
    const walletOfOwner = async (address: string): Promise<string[]> => {
      const result: string[] = await contract?.methods.walletOfOwner(address).call() || [];
      return result;
    };

    const getMetaData = async (tokenID: string): Promise<ITokenMetadata> => {
      const result = await contract?.methods.tokenURI(tokenID).call();
      return (await axios.get(result))?.data;
    };
    const mint = async (amount: number) => {
      if (!isConnected()) { return; }
      store.commit('data/setquantity', qty);
      await contract?.methods.mint(activeAddress.value, amount)
        .send({ from: activeAddress.value, value: Web3.utils.toWei((amount * pricePerNFT).toString()) })
        .once('transactionHash', (hash: string) => {
          closeMsg = toast({
            title: 'Waiting the transaction write into the blockchain...',
            type: ToastType.LOADING,
            timeout: -1,
          });
        })
        .once('receipt', async (receipt: IReceipt) => {
          closeMsg();
          if (receipt.status) {
            toast({
              title: 'Transaction Succeed',
              type: ToastType.SUCCESS,
            });
            const tokenList = await walletOfOwner(activeAddress.value);
            const cacheList: Promise<ITokenMetadata>[] = [];
            for (let index = tokenList.length - amount; index < tokenList.length; index += 1) {
              cacheList.push(getMetaData(tokenList[index]));
            }
            try {
              metadataList.value = await Promise.all(cacheList);
            } catch (error) {
              console.error(error);
              toast({
                title: 'Server Error',
                type: ToastType.FAILED,
              });
            }
          }
        })
        .on('error', (error: Error) => {
          console.error(error);
        });
    };
    const handleConnect = async () => {
      const address = await Metamask.getActiveAddress();
      if (address) {
        store.commit('data/setActiveAddress', address);
        store.commit('data/setIsAccountLocked', false);
        Metamask.detectingAccount();
      }
    };
    return {
      mintButton,
      showQty,
      qty,
      add,
      minus,
      reject,
      mint,
      input,
      handleConnect,
    };
  },
  // data() {
  //   return {
  //     mintButton: true,
  //     qty: 1,
  //   };
  // },
  // methods: {
  //   showQty() {
  //     this.mintButton = false;
  //   },
  //   add() {
  //     this.qty += 1;
  //     console.log(this.qty);
  //   },
  //   minus() {
  //     if (this.qty === 0) {
  //       this.qty = 0;
  //     } else {
  //       this.qty -= 1;
  //     }
  //   },
  //   async confirm() {
  //     console.log('confirm');
  //     const address = await Metamask.getActiveAddress();
  //     const store = useStore();
  //     if (address) {
  //       store.commit('data/setActiveAddress', address);
  //       store.commit('data/setIsAccountLocked', false);
  //       Metamask.detectingAccount();
  //     }
  //   },
  //   reject() {
  //     this.mintButton = true;
  //   },
  // },
});
</script>

<style lang="scss" scoped>
.readmore-container {
  background-image: url('~@img/bg2.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  height: 100vh;
  overflow: hidden;
  width: 100vw;
}

.btn-arrow {
  height: 20rem;
  position: absolute;
  right: 12rem;
  top: 8rem;
  user-select: none;
}

.btn-mint {
  border: 0.2rem solid #000;
  border-radius: 1.25rem;
  color: #000;
  height: 2.5rem;
  width: 12.5rem;
  position: absolute;
  bottom: 19rem;
  right: 14rem;
  cursor: pointer;
}

.mintControls {
  position: absolute;
  bottom: 10rem;
  right: 14rem;
}

.mint-container {
  border: 0.2rem solid #000;
  border-radius: 1.25rem;
  background-color: #fff;
  padding: 0.5rem;
  text-align: center;
}

h5{
  color: #000;
  font-size: 1rem;
  margin: 0.3rem;
}

.qty {
  color: #2EA7E0;
  font-size: 1.2rem;
}

.price {
  color: #2EA7E0;
  font-weight: 100;
  font-size: 0.7rem;
  margin: 0;
}

.qty-control {
  display: flex;
  justify-content: space-between;
}

.qty-add, .qty-minus {
  outline: none;
  border: none;
  background-color: #fff;
  cursor: pointer;
}

.confirm-action, .reject-action {
  cursor: pointer;
}
</style>
