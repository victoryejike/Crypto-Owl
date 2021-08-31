import { createStore, createLogger } from 'vuex';
import modules from './modules/_index';

const isDevMode = process.env.NODE_ENV === 'development';

export default createStore({
  modules,
  actions: {
    reset({ commit }) {
      // resets state of all the modules
      Object.keys(modules).forEach((moduleName) => {
        commit(`${moduleName}/RESET`);
      });
    },
  },
  strict: isDevMode,
  plugins: isDevMode ? [createLogger()] : [],
});
