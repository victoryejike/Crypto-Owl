<template>
  <div
    ref="toast"
    class="toast-container"
  >
    <div
      v-if="imageData"
      class="toast-icon"
    >
      <img
        :src="imageData"
        width="36"
        height="36"
      >
    </div>
    <div
      class="toast-content"
      :class="type"
    >
      <div class="toast-content-title">
        {{ title }}
      </div>
      <div class="toast-content-description">
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseToast',
  props: {
    title: { type: String, required: true },
    description: { type: String, required: false, default: null },
    type: { type: String, required: false, default: null },
  },
  setup(props) {
    const imageData = computed(() => {
      let data = null;
      if (props.type) {
        try {
          data = require(`@svg/toast-${props.type}.svg`);
        } catch (error) {
          //
        }
      }
      return data;
    });

    return {
      imageData,
    };
  },
});
</script>

<style lang="scss" scoped>
.toast-container {
  display: flex;
  font-size: 1rem;
  max-width: 20em;
  padding: 0.5em;
}

.toast-icon {
  align-items: center;
  display: flex;
  justify-content: center;
  margin-right: 1em;
}

.toast-content-title {
  color: rgba(0, 0, 0, 0.75);
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 0.2em;
}

.toast-content-description {
  color: rgba(0, 0, 0, 0.75);
  font-size: 0.9em;
}
</style>
