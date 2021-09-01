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
      <img
        src="@img/Frame.png"
        alt="owl-collections"
      >
      <img
        src="@img/Frame.png"
        alt="owl-collections"
      >
      <img
        src="@img/Frame.png"
        alt="owl-collections"
      >
      <img
        src="@img/Frame.png"
        alt="owl-collections"
      >
      <img
        src="@img/Frame.png"
        alt="owl-collections"
      >
      <img
        src="@img/Frame.png"
        alt="owl-collections"
      >
    </div>
    <button
      class="btn btn-more"
    >
      Get More
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Collections',
  setup() {
    const store = useStore();
    const activeAddress = computed(() => store.getters['data/activeAddress']);
    onMounted(() => {
      //
    });

    return {
      activeAddress,
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
