import web3Plugin from "~/plugins/web3";

export const networkNameID = {
  5777: "Local",
  97: "BSC-Test",
  56: "BSC",
  4: "Rinkeby",
  1: "ETH",
};

const web3 = {
  namespaced: true,
  state: () => ({
    web3: {
      networkId: null,
      balance: null,
      accountAddress: null, // Default value is lowcase characters
    },
  }),
  getters: {
    getInstance: (state) => {
      return state.web3;
    },
    getAccount: (state) => {
      return state.web3.accountAddress;
    },
    getNetID: (state) => {
      return state.web3.networkId;
    },
    getNetName: (state) => {
      if (!state.web3.networkId) return "Network";
      return networkNameID[state.web3.networkId]
        ? networkNameID[state.web3.networkId]
        : "Unknown";
    },
  },
  mutations: {
    registerWeb3Instance(state, payload) {
      // console.log('registerWeb3instance Mutation being executed', payload)
      let result = payload;
      let web3Copy = state.web3;
      web3Copy.accountAddress = result.coinbase;
      web3Copy.networkId = result.networkId;
      web3Copy.balance = web3Plugin.utils.fromWei(result.balance);
      state.web3 = web3Copy;
    },
    clearWeb3Instance(state) {
      state.web3 = {
        networkId: null,
        balance: null,
        accountAddress: null, // Default value is lowcase characters
      };
    },
  },
  actions: {},
};

export default web3;
