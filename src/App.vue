<template>
  <router-view />
  <AppWrongChainModal />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppWrongChainModal from './components/Layout/AppWrongChainModal.vue';

export default defineComponent({
  name: 'App',
  components: { AppWrongChainModal },
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noticia+Text&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Goblin+One&display=swap');

* {
  color: #fff;
  font-family: 'Goblin One', serif;
}

body {
  background: #2f6042;
  margin: 0;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
