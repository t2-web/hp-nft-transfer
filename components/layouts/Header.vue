<template>
  <nav class="navbar navbar-expand navbar-light nav-custom position-relative">
    <div class="container-fluid-header">
      <div class="logo">
        <a class="navbar-brand" :href="homeUrl">
          <div v-if="isTextLogo" class="text-white fs-4 fs-md-1">ENJOY LLC</div>
          <img v-else class="logo-img" src="~/assets/images/layouts/logo.png" />
        </a>
      </div>

      <div class="path-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
          <li class="nav-item header-menu">
            <nuxt-link class="nav-link" aria-current="page" to="/login"
              >Home</nuxt-link
            >
          </li>
          <li>
            <a class="header-link" :href="createNFTUrl">Create NFT</a>
          </li>
          <li>
            <a class="header-link" :href="sendTokenUrl">Send Token</a>
          </li>
          <li>
            <nuxt-link class="header-link" to="/">Send NFT</nuxt-link>
          </li>
        </ul>
      </div>

      <div class="d-flex">
        <div>
          <button v-if="networkId" class="btn-network">
            <b-dropdown :value="networkId">
              <template #button-content>
                {{ netWorkName }}
              </template>
              <b-dropdown-item
                @click="onChainChange(item)"
                v-for="item in networks"
                :key="item"
                :value="item"
              >
                {{ networkNameID[item] }}
              </b-dropdown-item>
            </b-dropdown>
          </button>
          <button v-else class="btn-network">
            <div class="d-none d-sm-block nav-text">
              {{ netWorkName }}
            </div>
          </button>
        </div>
        <div class="text-decoration-none">
          <button class="btn-user" @click="connectHandler">
            <div class="nav-text">
              {{ accAddress }}
            </div>
          </button>
        </div>
      </div>
    </div>
    <WalletSeclectorModal
      v-show="modalVisible"
      @modalHidden="toogleModal"
      @modalConfirm="confirmHandler"
      :modalInfo="modalInfo"
    />
  </nav>
</template>
<script>
import web3Plugin from "~/plugins/web3";
import providerManager from "~/plugins/web3-provider";
import { networkNameID } from "~/store/web3.js";
import { mapGetters, mapMutations, mapState } from "vuex";
import { chainInfo } from "~/constants/chains.js";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import Web3 from "web3";
const WC_MODE = {
  META_MASK: 1,
  WALLET_CONNECT: 2,
};

export default {
  name: "Header",
  computed: {
    accAddress() {
      const address = this.getAccount();
      if (address) {
        return `${address.substring(0, 6)}...${address.substring(
          address.length - 4
        )}`;
      } else {
        return "Connect Wallet";
      }
    },
    netWorkName() {
      return this.getNetName();
    },
    networkId() {
      return this.getNetID();
    },
    homeUrl() {
      return `${this.$config.rootPageUrl}`;
    },
    createNFTUrl() {
      return `${this.$config.rootPageUrl}/createnft`;
    },
    sendTokenUrl() {
      return `${this.$config.rootPageUrl}/sendtoken`;
    },
  },
  data() {
    return {
      isTextLogo: false,
      menuList: [
        {
          label: "Home",
          url: "/",
        },
      ],
      modalVisible: false,
      modalInfo: {
        modalTitle: "Please select a wallet connector",
      },
      networkNameID,
      networks: Object.keys(chainInfo).map((item) => Number(item)),
      chainInfo,
    };
  },
  async mounted() {},
  methods: {
    ...mapGetters("web3", ["getAccount", "getNetName", "getNetID"]),
    ...mapMutations("web3", ["registerWeb3Instance", "clearWeb3Instance"]),
    toogleModal(isVisible) {
      this.modalVisible = isVisible;
    },
    async connectHandler() {
      this.toogleModal(true);
    },
    async confirmHandler(walletMode) {
      // console.log("confirmHandler walletMode:", walletMode);
      this.toogleModal(false);

      if (walletMode === WC_MODE.WALLET_CONNECT) {
        this.initWC();
      } else {
        // Metamask connect
        this.initMetamask();
      }
    },
    async initWC(chain = 1) {
      let provider;
      try {
        provider = await EthereumProvider.init({
          projectId: "5e711c3787dfac9c25953b0c0e272951",
          chains: [chain],
          rpcMap: {
            [chain]: chainInfo[chain].rpcUrl,
          },
          showQrModal: true,
        });
        provider.on("connect", async (info) => {
          try {
            const instance = new Web3(provider);
            const networkId = Number(info.chainId);
            const accounts = await provider.request({
              method: "eth_requestAccounts",
            });
            const balance = await instance.eth.getBalance(accounts[0]);
            this.registerWeb3Instance({
              networkId,
              coinbase: accounts[0],
              balance,
            });
            providerManager.setProvider(
              provider,
              this.accountorChainChangeCb.bind(this),
              this.accountorChainChangeCb.bind(this),
              this.disconnectCb.bind(this)
            );
          } catch (err) {
            console.error("error in connect callback", err);
          }
        });

        await provider.connect();
      } catch (err) {
        console.error("Error in wc", err);
        this.clearWeb3Instance();
        return;
      }
    },
    async disconnectCb() {
      const provider = providerManager.getProvider();
      if (provider && provider.connected) {
        await provider.disconnect();
      }
      this.clearWeb3Instance();
    },
    async accountorChainChangeCb() {
      const instance = web3Plugin;
      const networkId = await instance.eth.net.getId();
      const coinbase = await instance.eth.getCoinbase();
      const balance = await instance.eth.getBalance(coinbase);
      this.registerWeb3Instance({
        networkId,
        coinbase,
        balance,
      });
    },
    async initMetamask() {
      // Check for web3 provider
      if (typeof window.ethereum !== "undefined") {
        try {
          // Ask to connect
          await window.ethereum.send("eth_requestAccounts");
          // const instance = new web3Plugin(window.ethereum);
          const instance = web3Plugin;
          // Get necessary info on your node
          const networkId = await instance.eth.net.getId();
          const coinbase = await instance.eth.getCoinbase();
          const balance = await instance.eth.getBalance(coinbase);

          // console.log("initWeb3 networkId: ", networkId);
          // console.log("coinbase networkId: ", coinbase);
          // console.log("balance networkId: ", balance);

          // Save it to store
          this.registerWeb3Instance({
            networkId,
            coinbase,
            balance,
          });
          providerManager.setProvider(
            window.ethereum,
            this.accountorChainChangeCb.bind(this),
            this.accountorChainChangeCb.bind(this),
            this.disconnectCb.bind(this)
          );
          // Back to home
          this.$router.push({
            path: "/",
          });
        } catch (error) {
          // User denied account access
          console.error("User denied web3 access", error);
          return;
        }
      }
      // No web3 provider
      else {
        this.$toast.error("Please install Meta mask");
        console.error("No web3 provider detected");
        return;
      }
    },
    async onChainChange(networkId) {
      if (providerManager.getProvider().isMetaMask) {
        await providerManager.switchChain({
          ...chainInfo[networkId],
          chain: networkId,
        });
      } else {
        await this.initWC(Number(networkId));
      }
    },
  },
};
</script>

<style scoped>
.nav-link {
  padding: 0px 1rem;
}

.nav-custom {
  background-color: #000000;
  height: 88px;
  /* -webkit-box-shadow: 0 4px 4px gray;
  -moz-box-shadow: 0 4px 4px gray;
  box-shadow: 0 4px 4px gray; */
}

.btn-network {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-width: 128px;
  height: 36px;
  background-color: #2a2a2d;
  color: #ffffff;
  border: none;
  padding-left: 16px;
  padding-right: 32px;
  margin-right: -24px;
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
}

::v-deep button.btn-network .btn.dropdown-toggle.btn-secondary {
  background: transparent;
  border: none;
}
::v-deep button.btn-network .dropdown-menu {
  background: #2a2a2d;
  border-radius: 24px;
}
::v-deep button.btn-network .dropdown-item {
  color: white;
  border-radius: 24px;
}
::v-deep button.btn-network .dropdown-item:hover {
  color: #2a2a2d;
}
.btn-user {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-width: 192px;
  height: 36px;
  background-color: #2a2a2d;
  color: #1da3c2;
  border-radius: 24px;
  border: 1px solid #1da3c2;
}

.btn-user:hover {
  background-color: #1da3c2;
  color: black;
  border: 1px solid #1da3c2;
  font-weight: bolder;
}

.nav-text {
  text-decoration: none;
  font-size: 16px;
  line-height: 20px;
}

.container-fluid-header {
  display: flex;
  flex-wrap: inherit;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.last {
  margin-right: 24px;
}
.path-collapse {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
  padding-right: 24px;
}
.logo {
  padding-left: 10px;
}
.logo-img {
  /* height: 48px; */
}

.header-link {
  text-align: center;
  margin: 0px 12px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
}
.header-link:hover {
  color: rgb(29, 163, 194);
}

@media only screen and (max-width: 826px) {
  .path-collapse {
    display: none;
  }

  .logo {
    padding-left: 0px;
  }
  .logo-img {
    height: 24px;
  }

  .btn-network {
    display: none;
  }
  .btn-user {
    width: auto;
  }
}
</style>
