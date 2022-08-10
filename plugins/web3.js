import Web3 from 'web3'

// const instance = new Web3(Web3.givenProvider || 'https://data-seed-prebsc-1-s1.binance.org:8545')
const instance = new Web3(Web3.givenProvider || 'http://localhost:7545')

export default instance
