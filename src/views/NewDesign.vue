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
        <img
          class="social-media-icon"
          src="@img/icon-opensea.png"
        >
        <img
          class="social-media-icon"
          src="@img/icon-twitter.png"
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ViewTemplate',
  setup(props, { attrs, slots, emit }) {
    return {
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

.btn:active {
  transform: translateY(0.1em);
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
