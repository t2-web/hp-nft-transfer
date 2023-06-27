import Web3 from "web3";
let providerManager = null;
class ProviderManager {
  provider = null;
  constructor() {
    console.log("initializing provider manager");
  }

  getProvider() {
    if (!this.provider) return Web3.givenProvider;
    return this.provider;
  }

  setProvider(provider, chainChangeCb, accountChangeCb, disconnectCb) {
    this.provider = provider;
    this.subscribeToEvents(
      provider,
      chainChangeCb,
      accountChangeCb,
      disconnectCb
    );
  }

  subscribeToEvents(provider, chainChangeCb, accountChangeCb, disconnectCb) {
    if (!provider) return;
    if (this.provider?.removeAllListeners) {
      this.provider.removeAllListeners();
    }

    this.provider.on("accountsChanged", (accounts) => {
      if (accounts.length) {
        if (accountChangeCb) {
          accountChangeCb(accounts[0]);
        }
      } else {
        if (disconnectCb) {
          console.log("no account availabe, disconnecting...");
          disconnectCb();
        }
      }
    });

    this.provider.on("chainChanged", (networkId) => {
      const chainId = Number(networkId);
      if (!chainId || isNaN(chainId)) {
        if (disconnectCb) {
          disconnectCb();
        }
      } else {
        if (chainChangeCb) {
          chainChangeCb(chainId);
        }
      }
    });

    this.provider.on("disconnect", (err) => {
      if (!provider.isMetaMask) {
        console.error("disconnect", err.message);
        if (disconnectCb) {
          disconnectCb();
        }
      }
    });
  }

  addChain({ explorer, name, nativeCurrency, rpcUrl, chain }) {
    this.provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: this.toHex(chain),
          chainName: name,
          nativeCurrency: {
            ...nativeCurrency,
          },
          rpcUrls: [rpcUrl],
          blockExplorerUrls: [explorer],
        },
      ],
    });
  }

  async switchChain({ explorer, name, nativeCurrency, rpcUrl, chain }) {
    try {
      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: this.toHex(chain) }],
      });
    } catch (error) {
      console.error("in switch chain", error);
      if (this.provider.isMetaMask && error.code === 4902) {
        this.addChain({
          explorer,
          name,
          nativeCurrency,
          rpcUrl,
          chain,
        });
      } else {
        throw error;
      }
    }
  }

  toHex(chainIdDec) {
    const chainInHex = `0x${Number(chainIdDec).toString(16)}`;
    return chainInHex;
  }
}

if (!providerManager) {
  providerManager = new ProviderManager();
}

export default providerManager;
