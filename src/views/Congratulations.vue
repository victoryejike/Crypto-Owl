<template>
  <div class="collections-container">
    <div class="collections-padding">
      <h2></h2>
      <button
        class="btn btn-wallet"
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
    <div class="btn-group">
      <button
        class="btn btn-more"
        @click="$router.push('/more')"
      >
        Get More
      </button>
      <button
        class="btn btn-collections"
        @click="$router.push('/collections')"
      >
        View Your Collection
      </button>
    </div>
  </div>
</template>

<script lang="ts">

import {
  defineComponent, onMounted, computed,
} from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Congratulations',
  setup() {
    const store = useStore();
    const activeAddress = computed(() => store.getters['data/activeAddress']);

    // };
    onMounted(async () => {
      //
    });
    return {
      activeAddress,
      // handleConnect,
    };
  },
});
</script>

<style lang="scss" scoped>
.collections-container {
  background-image: url('~@img/bg4.jpg');
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

.btn-group {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 18rem;
}

.btn-more, .btn-collections {
  background-color: #ecd963;
  color: #000;
  margin: 5rem auto;
  padding: 1rem 3rem;
  cursor: pointer;
}

.btn-collections {
  background-color: #ECEAE1;
  margin-left: 1rem;
}
</style>
