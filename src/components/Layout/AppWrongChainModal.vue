<template>
  <BaseModal
    ref="modal"
    :has-closed-btn="false"
  >
    <template #body>
      <h2 class="modal-text">
        {{ 'Please Change Your Network' }}
      </h2>
      <p class="modal-text">
        {{ `You are not on the ${chainNameList[chainID]} network` }}
      </p>
    </template>
  </BaseModal>
</template>

<script lang="ts">
import {
  computed, ComputedRef, defineComponent, ref, watch,
} from 'vue';
import { useStore } from 'vuex';
import BaseModal from '../UI/BaseModal.vue';

export default defineComponent({
  name: 'AppWrongChainModal',
  setup() {
    const store = useStore();

    const modal = ref<typeof BaseModal>();
    const chainNameList = {
      '0x1': 'Ethereum Main Network (Mainnet)',
      '0x3': 'Ropsten Test Network',
      '0x4': 'Rinkeby Test Network',
      '0x5': 'Goerli Test Network',
      '0x2a': 'Kovan Test Network',
    };

    const chainID: ComputedRef<string|undefined> = computed(() => process.env.VUE_APP_ETH_CHAIN_ID);

    watch(() => store.getters['data/isWrongChain'], (status: boolean) => {
      modal.value?.setModalVisible(status === true);
    });

    return {
      modal, chainNameList, chainID,
    };
  },
});
</script>

<style lang="scss" scoped>
.modal-text {
  color: #000;
  text-align: center;
}
</style>
