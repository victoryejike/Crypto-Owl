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
        class="no-nft"
      >
        No New NFTs to display
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
import { ITokenMetadata } from '@type/interface';
import {
  defineComponent, onMounted, computed, ref, reactive,
} from 'vue';
import { useStore } from 'vuex';
import { Skeletor } from 'vue-skeletor';
import Metamask from '@/utils/metamask';
import 'vue-skeletor/dist/vue-skeletor.css';

export default defineComponent({
  name: 'Collections',
  components: { Skeletor },
  setup() {
    const metadataList = ref<ITokenMetadata[]>([]);
    const store = useStore();
    const activeAddress = computed(() => store.getters['data/activeAddress']);
    const nfts = computed(() => store.getters['data/nfts']);
    const input = reactive({
      amount: 1,
      toAddress: null,
      transferTokenID: null,
      address: null,
      tokenID: null,
    });

    onMounted(async () => {
      //
      const address = await Metamask.getActiveAddress();
      if (address) {
        store.commit('data/setActiveAddress', address);
        store.commit('data/setIsAccountLocked', false);
        Metamask.detectingAccount();
      }

      metadataList.value = nfts.value;
    });
    return {
      activeAddress,
      input,
      metadataList,
      // handleConnect,
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
  max-width: 100vw;
}

.collections-padding {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6rem 5rem;
}

.no-nft {
  text-align: center;
}

.bought-result {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  .nft-card {
    padding: 1rem;
    width: 30%;
  }

  .nft-card-img {
    width: 100%;
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
