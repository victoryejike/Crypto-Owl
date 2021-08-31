<template>
  <div>
    <!--  -->
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, onMounted, reactive, ref,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'ComponentTemplate',
  setup(props, { attrs, slots, emit }) {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const data = ref(1);
    const objectData = reactive({});

    const computedData = computed(() => data.value * 2);

    onMounted(() => {
      //
    });

    return {
      data, objectData, computedData,
    };
  },
});
</script>

<style lang="scss" scoped>
  //
</style>
