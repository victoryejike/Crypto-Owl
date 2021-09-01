interface IState {
  isWrongChain: boolean;
  isMonitoringChain: boolean;
  isAccountLocked: boolean;
  isMonitoringAccount: boolean;
  activeAddress: string | null;
  quantity: number | null;
}

const initialState = () => (<IState>{
  isWrongChain: false,
  isMonitoringChain: false,
  isAccountLocked: false,
  isMonitoringAccount: false,
  activeAddress: null,
  quantity: null,
});

const getters: { [key: string]: any } = {
  isWrongChain(state: IState) {
    return state.isWrongChain;
  },
  isMonitoringChain(state: IState) {
    return state.isMonitoringChain;
  },
  isAccountLocked(state: IState) {
    return state.isAccountLocked;
  },
  isMonitoringAccount(state: IState) {
    return state.isMonitoringAccount;
  },
  activeAddress(state: IState) {
    return state.activeAddress;
  },
  quantity(state: IState) {
    return state.quantity;
  },
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
  setIsWrongChain(state: IState, value: boolean) {
    state.isWrongChain = value;
  },
  setIsMonitoringChain(state: IState, value: boolean) {
    state.isMonitoringChain = value;
  },
  setIsAccountLocked(state: IState, value: boolean) {
    state.isAccountLocked = value;
  },
  setIsMonitoringAccount(state: IState, value: boolean) {
    state.isMonitoringAccount = value;
  },
  setActiveAddress(state: IState, value: string | null) {
    state.activeAddress = value;
  },
  setquantity(state: IState, value: number | null) {
    state.quantity = value;
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
