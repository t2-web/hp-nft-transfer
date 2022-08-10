<template>
  <div class="wallet-confirm-modal">
    <div class="d-flex align-items-center justify-content-between">
      <span class="modal-title">{{
        modalInfo.modalTitle ? modalInfo.modalTitle : "Modal title"
      }}</span>
      <button @click="handleModalClose" class="modal-close-btn">
        <img class="close-icon" src="~/assets/images/nftTransfer/close.svg" />
      </button>
    </div>
    <div class="row d-flex mt-4 px-2 px-md-4 justify-content-center">
      <button
        class="w-100 py-3 btn-confirm-wallet"
        @click="handleModalConfirm(1)"
      >
        <img
          class="btn-icon mr-2"
          src="~/assets/images/layouts/metamask-logo.png"
        />
        Meta mask
      </button>
    </div>
    <div class="row d-flex my-4 px-2 px-md-4 justify-content-center">
      <button
        class="w-100 px-auto py-3 btn-confirm-wallet"
        @click="handleModalConfirm(2)"
      >
        <img
          class="btn-icon mr-2"
          src="~/assets/images/layouts/walletconnect.png"
        />
        Wallet Connect
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: "WalletSeclectorModal",
  props: ["modalInfo"],
  data() {
    return {
      contractAddress: "0x669338C4E9e9B759cD1A5261136872aCEd75Cf80",
      contractName: "Dark Night",
      assetBalance: 10,
    };
  },

  methods: {
    handleModalClose() {
      this.$emit("modalHidden", false);
    },
    async handleModalConfirm(walletMode) {
      // console.log("handleModalConfirm: ", this.modalInfo);
      this.$emit("modalConfirm", walletMode);
    },
  },
};
</script>

<style scoped>
.wallet-confirm-modal {
  width: 50%;
  height: auto;
  background: #000000;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.8);
  border-radius: 14px;
  position: fixed;
  z-index: 2;
  top: 25%;
  left: 25%;
  padding: 12px;
  color: #6f7273;
}

.modal-title {
  font-weight: 500;
  font-size: 20px;
  color: #ffffff;
}

.modal-close-btn {
  border: none;
  background: transparent;
}

.close-icon {
  width: 32px;
}

.btn-icon {
  width: 36px;
}

.text-hight {
  color: #1da3c2;
  font-weight: bold;
}

.btn-confirm-wallet {
  background-color: #2a2a2d;
  border-radius: 32px;
  border: 1px solid #1da3c2;
  color: whitesmoke;
}

.btn-confirm-wallet:hover {
  color: #1da3c2;
}

@media only screen and (max-width: 390px) {
  .wallet-confirm-modal {
    width: 96%;
    background: #2a2a2d;
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.8);
    border-radius: 14px;
    position: fixed;
    z-index: 2;
    top: 25%;
    left: 2%;
    padding: 12px;
    color: #c4c4c4;
  }

  .modal-title {
    font-weight: bolder;
    font-size: 16px;
    color: #ffffff;
  }
}
</style>