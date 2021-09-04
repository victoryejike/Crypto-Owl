<template>
  <div
    class="index-container"
  >
    <div class="index-padding">
      <h1 class="index-title">
        Hatch and Grow your crypto owls
        <div class="owl-container">
          <img
            class="owl-popout"
            src="@img/Owl-Blue.png"
          >
        </div>
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
        <div class="owl-container">
          <img
            class="owl-pop"
            src="@img/Owl-Bronze.png"
          >
        </div>
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
      <div class="owl-container">
        <img
          class="owl-popin"
          src="@img/Owl-Green.png"
        >
      </div>
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

    const popblue = () => {
      const popout = document.querySelector('.owl-popout');
      console.log(popout);
      popout?.classList.add('owl-blue');
      popout?.classList.add('owl-blue-transition');
      setTimeout(() => {
        popout?.classList.remove('owl-blue');
        popout?.classList.remove('owl-blue-transition');
      }, 6000);
    };

    const popgreen = () => {
      const popin = document.querySelector('.owl-popin');
      console.log(popin);
      popin?.classList.add('owl-green');
      popin?.classList.add('owl-green-transition');
      setTimeout(() => {
        popin?.classList.remove('owl-green');
        popin?.classList.remove('owl-green-transition');
      }, 2000);
    };

    const popbronze = () => {
      const pop = document.querySelector('.owl-pop');
      console.log(pop);
      // pop?.classList.add('owl-green');
      pop?.classList.add('owl-bronze');
      setTimeout(() => {
        pop?.classList.remove('owl-bronze');
      }, 4000);
    };

    const loopOwls = () => {
      // pop();
      setInterval(popblue, 7000);
      setInterval(popgreen, 3000);
      setInterval(popbronze, 5000);
    };

    loopOwls();

    onMounted(async () => {
      if (await Metamask.detectingChain()) {
        Metamask.initAccount();
        Metamask.detectingAccount();
      }
      loopOwls();
    });

    return {
      transferFrom,
      handleConnect,
      isLoading,
      metadataList,
      input,
      activeAddress,
      totalBuy,
      loopOwls,
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
  position: relative;
}

.index-padding {
  flex-grow: 1;
  padding: 6rem 5rem;
}

.index-title {
  position: relative;
  font-size: 2rem;
  width: 26rem;
  z-index: 1000;
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
  font-size: 0.8em;
  margin-top: 4rem;
  outline: 0;
  padding: 0.9em 2em;
  position: relative;
  z-index: 100;
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

.owl-container {
  position: absolute;
  display: block;
  width: 50%;
  height: 50%;
}

.owl-blue-transition {
  /* display: none; */
  transition: all .4s;
  transform: rotateZ(180deg);
}

.owl-green-transition {
  transition: all .4s;
  transform: translate(50%, 50%);
}

.owl-blue {
  bottom: 6.4rem;
  left: 0rem;
  z-index: -1;
  /* transform: rotateZ(-45deg); */
  width: 10rem;
  position: absolute;
  /* transition: all .2s; */
}

.owl-bronze {
  top: 2rem;
  left: 8rem;
  z-index: -1;
  width: 18rem;
  position: absolute;
  transform: rotateZ(45deg) translate(-10%, -10%);
}

.owl-green {
  bottom: 1rem;
  right: -15rem;
  z-index: -1;
  width: 10rem;
  position: absolute;
  transform: rotateZ(45deg) ;
}
</style>
