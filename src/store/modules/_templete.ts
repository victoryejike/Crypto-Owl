const initialState = () => ({

});

const getters: { [key: string]: any } = {

};

const actions: { [key: string]: any } = {

};

const mutations = {
  RESET(state: { [key: string]: any }) {
    const newState: { [key: string]: any } = initialState();
    Object.keys(newState).forEach((key) => {
      state[key] = newState[key];
    });
  },
};

const state = initialState();

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
