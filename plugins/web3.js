import Web3 from "web3";

// const instance = new Web3(Web3.givenProvider || 'https://data-seed-prebsc-1-s1.binance.org:8545')
import providerManager from "@/plugins/web3-provider";
export default new Web3(
  providerManager.getProvider() || "http://localhost:7545"
);
