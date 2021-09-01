<template>
  <div class="collections-container">
    <div class="collections-padding">
      <h2>Your Collection</h2>
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
          class="btn-text"
        >
          {{ `${activeAddress}` }}
        </span>
      </button>
    </div>
    <div class="collections-list">
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
      <div
        v-else
      >
        No NFTs to display
      </div>
    </div>
    <button
      class="btn btn-more"
      @click="$router.push('/more')"
    >
      Get More
    </button>
  </div>
</template>

<script lang="ts">
import { IReceipt, ITokenMetadata } from '@type/interface';
import axios from '@util/axios';
import {
  defineComponent, onMounted, computed, ref, reactive,
} from 'vue';
import { useStore } from 'vuex';
import { Skeletor } from 'vue-skeletor';
import Metamask from '@/utils/metamask';
import toast from '@/utils/toast';
import { ToastType } from '@/types/enums';
import 'vue-skeletor/dist/vue-skeletor.css';

const ContractABI = require('@/assets/abi/owls-uat.json');

const CONTRACT_ADDRESS = process.env.VUE_APP_CONTRACT_ADDRESS;

export default defineComponent({
  name: 'Collections',
  components: { Skeletor },
  setup() {
    const contract = Metamask.initContract(ContractABI, CONTRACT_ADDRESS);
    const metadataList = ref<ITokenMetadata[]>([]);
    const store = useStore();
    const activeAddress = computed(() => store.getters['data/activeAddress']);
    const quantity = computed(() => store.getters['data/quantity']);
    const input = reactive({
      amount: 1,
      toAddress: null,
      transferTokenID: null,
      address: null,
      tokenID: null,
      quantity: 1,
    });

    const walletOfOwner = async (address: string): Promise<string[]> => {
      const result: string[] = await contract?.methods.walletOfOwner(address).call() || [];
      return result;
    };

    const getMetaData = async (tokenID: string): Promise<ITokenMetadata> => {
      const result = await contract?.methods.tokenURI(tokenID).call();
      return (await axios.get(result))?.data;
    };
    onMounted(async () => {
      //
      const tokenList = await walletOfOwner(activeAddress.value);
      if (tokenList.length > 0) {
        const cacheList: Promise<ITokenMetadata>[] = [];
        console.log(quantity.value);
        for (let index = tokenList.length - quantity.value; index < tokenList.length; index += 1) {
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
      } else {
        console.log(tokenList);
      }
    });
    return {
      activeAddress,
      input,
      metadataList,
    };
  },
});
</script>

<style lang="scss" scoped>
.collections-container {
  background-image: url('~@img/bg1.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  /* display: flex; */
  min-height: 100vh;
  overflow: hidden;
  width: 100vw;
}

.collections-padding {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6rem 5rem;
}

.collections-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  & > * {
    margin: 6rem;
  }
}

.btn-wallet {
  display: flex;
  align-items: center;
  font-weight: 600;
  align-self: start;
  margin: 0.7rem 2rem;
  background-color: rgba(0, 0, 0, 0.678);
  color: #fff;
  border: 1px solid #fff;
  border-radius: 100px;
}

.metamask-logo {
  height: 2.5rem;
  margin-right: 0.8rem;
}

.btn-more {
  background-color: #ecd963;
  color: #000;
  display: block;
  margin: 5rem auto;
  padding: 1rem 3rem;
  cursor: pointer;
}
</style>
