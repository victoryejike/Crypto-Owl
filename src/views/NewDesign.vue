<template>
  <div class="index-container">
    <div class="index-padding">
      <h1 class="index-title">
        Hatch and Grow your crypto owls
      </h1>
      <div class="index-description">
        Crypto Owl is the hero flying around the fun, vibrant and adventurous OWL World metaverse found in the vast
        forest of blockchain. The rare owl and gold eggs are waiting to be found and hatched.
      </div>
      <button
        type="button"
        class="btn"
        @click="$router.push('/more')"
      >
        Read More
      </button>
      <div class="social-media-div">
        <span>Share:</span>
        <a href="https://opensea.io">
          <img
            class="social-media-icon"
            src="@img/icon-opensea.png"
          >
        </a>
        <a href="https://twitter.com">
          <img
            class="social-media-icon"
            src="@img/icon-twitter.png"
          >
        </a>
      </div>
      <button
        v-if="activeAddress"
        type="button"
        class="btn btn-collection"
        @click="$router.push('/collections')"
      >
        View Your Collection
      </button>
    </div>
    <button
      class="btn btn-wallet"
      :class="activeAddress ? 'btn-disable' : null"
      @click="handleConnect"
    >
      <img
        src="@img/metamask.png"
        alt="metamask logo"
        class="metamask-logo"
      >
      <span
        v-if="activeAddress"
        class="btn-text"
      >
        {{ `${activeAddress}` }}
      </span>
      <span
        v-else
        class="btn-text"
      >
        Connect<br>Metamask
      </span>
    </button>
  </div>
</template>

<script lang="ts">
// import { defineComponent } from 'vue';
import { IReceipt, ITokenMetadata } from '@type/interface';
import {
  computed,
  defineComponent, onMounted, reactive, ref,
} from 'vue';
import { useStore } from 'vuex';
import Metamask from '@/utils/metamask';
import toast from '@/utils/toast';
import { ToastType } from '@/types/enums';
import 'vue-skeletor/dist/vue-skeletor.css';

const ContractABI = require('@/assets/abi/owls-uat.json');

const CONTRACT_ADDRESS = process.env.VUE_APP_CONTRACT_ADDRESS;

export default defineComponent({
  name: 'ViewTemplate',
  setup(props, { attrs, slots, emit }) {
    // let closeMsg: () => void | null;
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
      qty: null,
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

    onMounted(async () => {
      if (await Metamask.detectingChain()) {
        Metamask.initAccount();
        Metamask.detectingAccount();
      }
    });

    return {
      transferFrom,
      handleConnect,
      isLoading,
      metadataList,
      input,
      activeAddress,
      totalBuy,
    };
  },
});
</script>

<style lang="scss" scoped>
.index-container {
  background-image: url('~@img/bg1.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  height: 100vh;
  overflow: hidden;
  width: 100vw;
}

.index-padding {
  flex-grow: 1;
  padding: 6rem 5rem;
}

.index-title {
  font-size: 2rem;
  width: 26rem;
}

.index-description {
  font-family: 'Noticia Text', serif;
  font-size: 0.9rem;
  line-height: 160%;
  width: 23.5rem;
}

.btn {
  background-color: #ecd963;
  border-radius: 0.2em;
  border-width: 0;
  color: #000;
  cursor: pointer;
  font-size: 0.8em;
  margin-top: 4rem;
  outline: 0;
  padding: 0.9em 2em;
}

.btn-wallet {
  display: flex;
  align-items: center;
  font-weight: 600;
  align-self: start;
  margin: 0 4rem;
  margin-top: 7.3rem;
  background-color: rgba(0, 0, 0, 0.678);
  color: #fff;
  border: 1px solid #fff;
  border-radius: 100px;
}

.btn-collection {
  display: block;
  background-color: #ECEAE1;
}

.btn-text {
  text-align: left;
}

.btn:active {
  transform: translateY(0.1em);
}

.metamask-logo {
  height: 2.5rem;
  margin-right: 0.8rem;
}

.social-media-div {
  align-items: center;
  bottom: 4rem;
  display: flex;
  left: 5rem;
  position: absolute;
}

.social-media-icon {
  cursor: pointer;
  margin-left: 0.8em;
  user-select: none;
}

.social-media-icon:active {
  transform: translateY(0.1em);
}
</style>
