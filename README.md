# NFT Transfer System

## Terms of Use
This code is prohibited for paid use.
Please contact us for more information
https://t2web.co.jp/

## Build Setup - Node version: v16.13.1

### Install dependencies
```bash
yarn install
```  

### Fill in deployed smart contract address to the file `./contracts/NftTransfer.json`
```bash
"addresses": {
    "97": "0x0e79b465A519fF3D70222686745CB1Db58c95Dd0",
    "56": "0x????", // For BSC mainnet
    "4": "0x4c72f4fd44d007e36e658646ba2D9aAd184f456d",
    "1": "0x????",  // For ETH mainnet
  }
```  

### Setup env variables and fill in the value of `NUXT_ENV_NFT_SYSTEM_ADDRESS`
```bash
cp env.example .env
``` 

### Serve with hot reload at localhost:3000
```bash
yarn dev
``` 

### Build for production and launch server
```bash
yarn build
yarn start
``` 
### Generate static project
```bash
yarn generate
```