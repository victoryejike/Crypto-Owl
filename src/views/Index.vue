<template>
  <div class="index-container">
    <img
      class="bg-elements img-two-egg"
      src="@img/two-egg.png"
    >
    <img
      class="bg-elements img-egg-mask"
      src="@img/egg-mask.png"
    >
    <img
      class="bg-elements img-bg"
      src="@img/bg.jpg"
    >
    <img
      class="bg-elements img-owl"
      src="@img/owl.png"
    >
    <img
      class="bg-elements img-left-grass"
      src="@img/left-grass.png"
    >
    <img
      class="bg-elements img-right-grass"
      src="@img/right-grass.png"
    >

    <div class="top-section">
      <img
        class="img-logo"
        src="@img/logo.png"
      >
      <div class="div-egg">
        <span class="index-text">
          The WonderQuest is an immersive exploration of Alison Wonderland’s virtual world of dragons and black magic.
          It starts with a generative NFT project of ten thousand splendorous eggs,
          each containing that most rare and dangerous of creatures;
          a dragon. You can hatch your eggs to reveal your dragon’s unique traits,
          or collect them in their unhatched glory. To hatch or not to hatch; that choice is yours.
        </span>
      </div>
      <button
        class="btn btn-wallet"
        :class="activeAddress ? 'btn-disable' : null"
        @click="handleConnect"
      >
        {{ activeAddress ? `Address: ${activeAddress}` : 'Connect Wallet' }}
      </button>
    </div>

    <div class="bottom-section">
      <img
        class="img-buy-owl"
        src="@img/buy-owl.png"
      >
      <div class="buy-owl-block">
        <div class="buy-owl-header">
          Crypto Owl
        </div>
        <div class="buy-owl-content">
          The WonderQuest is an immersive exploration of Alison Wonderland’s virtual world of dragons and black magic.
          It starts with a generative NFT project of ten thousand splendorous eggs,
          each containing that most rare and dangerous of creatures; a dragon.
          You can hatch your eggs to reveal your dragon’s unique traits, or collect them in their unhatched glory.
          To hatch or not to hatch; that choice is yours.
        </div>
        <div class="buy-owl-footer">
          <button
            class="btn minus-btn"
            @click="setTotoalBuy(totalBuy - 1)"
          >
            -
          </button>
          <button
            class="btn buy-owl-btn"
            @click="mint(totalBuy)"
          >
            Buy {{ totalBuy }} Owl
          </button>
          <button
            class="btn add-btn"
            @click="setTotoalBuy(totalBuy + 1)"
          >
            +
          </button>
        </div>
      </div>
      <div
        v-if="metadataList?.length > 0"
        class="bought-result"
      >
        <i
          class="close"
          @click="metadataList = []"
        />
        <div
          v-for="(data, index) in metadataList"
          :key="index"
          class="nft-card"
        >
          <img
            :style="{opacity: (isLoading) ? 0 : 1}"
            class="nft-card-img"
            :src="data?.image"
            @load="isLoading = false"
          >
          <Skeletor
            :style="{opacity: (isLoading) ? 1 : 0}"
            class="nft-card-skeletor"
          />
          <div class="nft-card-footer">
            {{ data?.name }}
          </div>
        </div>
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
import Web3 from 'web3';
import { useStore } from 'vuex';
import { Skeletor } from 'vue-skeletor';
import Metamask from '@/utils/metamask';
import toast from '@/utils/toast';
import { ToastType } from '@/types/enums';
import 'vue-skeletor/dist/vue-skeletor.css';

const ContractABI = require('@/assets/abi/owls-uat.json');

const CONTRACT_ADDRESS = process.env.VUE_APP_CONTRACT_ADDRESS;
const pricePerNFT = 0.03;

export default defineComponent({
  name: 'Index',
  components: { Skeletor },
  setup() {
    let closeMsg: () => void | null;
    const totalBuy = ref(1);
    const isLoading = ref(true);
    const contract = Metamask.initContract(ContractABI, CONTRACT_ADDRESS);
    const metadataList = ref<ITokenMetadata[]>([]);
    const input = reactive({
      amount: 1,
      toAddress: null,
      transferTokenID: null,
      address: null,
      tokenID: null,
    });

    const store = useStore();
    const activeAddress = computed(() => store.getters['data/activeAddress']);

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

    const transferFrom = async (to: string, tokenID: string) => {
      if (!isConnected()) { return; }

      await contract?.methods.transferFrom(activeAddress.value, to, tokenID)
        .send({ from: activeAddress.value })
        .once('transactionHash', async (hash: string) => {
          //
        })
        .once('receipt', async (receipt: IReceipt) => {
          //
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

    const setTotoalBuy = (total: number) => {
      if (total > 0 && total < 21) { totalBuy.value = total; }
    };

    onMounted(async () => {
      if (await Metamask.detectingChain()) {
        Metamask.initAccount();
        Metamask.detectingAccount();
      }
    });

    return {
      mint,
      transferFrom,
      walletOfOwner,
      handleConnect,
      isLoading,
      metadataList,
      input,
      activeAddress,
      totalBuy,
      setTotoalBuy,
    };
  },
});
</script>

<style lang="scss" scoped>
.index-container {
  height: 200vh;
}

.top-section {
  height: 100vh;
}

.bottom-section {
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
}

.bg-elements {
  pointer-events: none;
  position: absolute;
  user-select: none;
}

.img-owl {
  top: 10rem;
  z-index: 2;
}

.img-left-grass {
  left: 0;
  top: 40rem;
}

.img-right-grass {
  right: 0;
  top: 35rem;
  z-index: 5;
}

.img-bg {
  border-radius: 3.2rem 0 0 3.2rem;
  right: 0;
  top: 17.5rem;
  z-index: 3;
}

.img-two-egg {
  right: 52rem;
  top: 28rem;
  z-index: 6;
}

.img-egg-mask {
  right: 0;
  z-index: 1;
}

.div-egg {
  align-items: center;
  background-image: url('~@img/egg.png');
  display: flex;
  height: 35rem;
  justify-content: center;
  position: absolute;
  right: 12rem;
  top: 12rem;
  width: 25rem;
  z-index: 4;
}

.index-text {
  padding: 0 3.5em 0 4em;
  text-align: center;
}

.img-logo {
  left: 5rem;
  position: absolute;
  top: 3rem;
}

.img-buy-owl {
  cursor: pointer;
  height: 28.625rem;
  width: 28.625rem;
}

.buy-owl-block {
  margin-left: 4rem;
  width: 35rem;
}

.buy-owl-header {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.buy-owl-content {
  margin-bottom: 3rem;
}

.btn {
  background: transparent;
  border: 0.1rem solid #fff;
  cursor: pointer;
  font-size: 1.2rem;
  margin: 0 0.5rem 0 0.5rem;
  outline: 0;
}

.btn-disable {
  pointer-events: none;
}

.buy-owl-btn {
  padding: 0.2em 2.5em;
}

.btn:active {
  transform: translateY(0.2rem);
}

.btn-wallet {
  position: absolute;
  right: 5rem;
  top: 4rem;
}

.minus-btn,
.add-btn {
  padding: 0.2rem 0.6rem;
}

.bought-result {
  align-items: center;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 0.5rem;
  bottom: 0;
  display: grid;
  grid-column-gap: 3rem;
  grid-row-gap: 3rem;
  grid-template-columns: repeat(auto-fit, 16rem);
  height: 100vh;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  width: 100vw;
  z-index: 10;
}

.nft-card {
  align-items: center;
  background-color: #303339;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  height: 22rem;
  transition: all 0.3s;
  width: 16rem;
}

.nft-card:hover {
  filter: brightness(110%);
  transform: translateY(-0.5rem);
}

.nft-card-img {
  border-radius: 0.5rem;
  height: 14rem;
  margin-top: 2rem;
  position: absolute;
  transition: all 0.5s;
  width: 14rem;
  z-index: 2;
}

.nft-card-skeletor {
  border-radius: 0.5rem;
  height: 14rem;
  margin-top: 2rem;
  transition: all 0.5s;
  width: 14rem;
}

.nft-card-footer {
  font-size: 1.5rem;
  margin-top: 18rem;
  position: absolute;
}

.close {
  color: #000;
  cursor: pointer;
  height: 3rem;
  position: absolute;
  right: 3rem;
  top: 3rem;
  width: 3rem;
  z-index: 20;
}

.close:hover {
  opacity: 0.5;
}

.close::before,
.close::after {
  background-color: #000;
  content: ' ';
  height: 3rem;
  left: 0;
  position: absolute;
  width: 0.3rem;
}

.close::before {
  transform: rotate(45deg);
}

.close::after {
  transform: rotate(-45deg);
}
</style>
