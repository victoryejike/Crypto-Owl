<template>
  <Transition name="fade">
    <div
      v-show="isVisible"
      class="modal-backdrop"
      @click.self="hasClosedBtn ? setModalVisible(false) : null"
    >
      <Transition name="drop">
        <div
          v-show="isVisible"
          class="modal"
          :style="{'--width': `${width}rem`}"
        >
          <div
            class="modal-wrapper"
          >
            <img
              v-if="hasClosedBtn"
              class="modal-close-icon"
              height="25"
              src="@svg/icon-cross.svg"
              width="25"
              @click="setModalVisible(false)"
            >
          </div>

          <div
            v-if="$slots.header"
            class="modal-header"
          >
            <slot name="header" />
          </div>

          <div
            v-if="$slots.body"
            class="modal-body"
          >
            <slot name="body" />
          </div>

          <div
            v-if="$slots.footer"
            class="modal-footer"
          >
            <slot name="footer" />
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'BaseModal',
  props: {
    hasClosedBtn: { type: Boolean, required: false, default: true },
    width: { type: Number, required: false, default: 20 },
  },
  setup() {
    const isVisible = ref(false);

    const setModalVisible = (status: boolean) => { isVisible.value = status; };

    return {
      isVisible, setModalVisible,
    };
  },
});
</script>

<style lang="scss" scoped>
.modal-backdrop {
  align-items: center;
  background-color: rgba(235, 235, 235, 0.75);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 999;
}

.modal {
  background: #fff;
  border-radius: 0.6rem;
  display: flex;
  flex-direction: column;
  padding: 0.625rem 2rem;
  width: var(--width);
  z-index: 999;
}

.modal-wrapper {
  display: flex;
  margin-bottom: 1.5rem;
}

.modal-close-icon {
  cursor: pointer;
  margin-left: auto;
}

.modal-header {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 3rem;
}

.modal-body {
  margin-bottom: 3rem;
}

.modal-footer {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}
</style>
