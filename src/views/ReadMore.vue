<template>
  <div class="readmore-container">
    <img
      class="btn-arrow"
      src="@svg/btn-arrow.svg"
    >
    <button
      class="btn-mint"
      type="button"
      @click="handleMint"
    >
      Click to Mint
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'ReadMore',
  setup() {
    onMounted(() => {
      //
    });

    return {

    };
  },
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
  top: 12rem;
  user-select: none;
}

.btn-mint {
  border: 0.2rem solid #000;
  border-radius: 1.25rem;
  color: #000;
  height: 2.5rem;
  width: 12.5rem;
}
</style>
