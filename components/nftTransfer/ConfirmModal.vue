<template>
  <div class="confirm-modal">
    <div class="d-flex align-items-center justify-content-between">
      <span class="modal-title">{{
        modalInfo.modalTitle ? modalInfo.modalTitle : "Modal title"
      }}</span>
      <button @click="handleModalClose" class="modal-close-btn">
        <img class="close-icon" src="~/assets/images/nftTransfer/close.svg" />
      </button>
    </div>
    <div class="px-md-5 mt-3">
      <span>{{ modalInfo.content ? modalInfo.content : "Modal content" }}</span>
      <span class="text-hight">
        {{
          modalInfo.nftName
            ? modalInfo.nftName == "NA"
              ? ""
              : modalInfo.nftName
            : "Modal nftName"
        }}</span
      >
      <span> to your list.</span>
    </div>
    <div class="px-md-5">
      <span>At: </span>
      <span class="text-hight">
        {{
          modalInfo.inputSCAddress ? modalInfo.inputSCAddress : "Modal address"
        }}</span
      >
    </div>
    <div
      class="px-md-5"
      v-if="modalInfo && modalInfo.balance && modalInfo.balance !== 'NA'"
    >
      <span>Your asset balance: </span>
      <span class="text-hight">
        {{ modalInfo.balance ? modalInfo.balance : "Modal balance" }}</span
      >
      <span> NFTs</span>
    </div>
    <div class="row d-flex w-100 mt-4 justify-content-center">
      <button
        :class="
          modalInfo.modalMode === 1
            ? 'w-50 py-2 btn-confirm'
            : 'w-50 py-2 btn-confirm-remove'
        "
        @click="handleModalConfirm"
      >
        <img
          id="confirm"
          style="width: 28px; margin-right: 8px"
          src="~/assets/images/nftTransfer/confirm icon.png"
        />
        Confirm
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: ["modalInfo"],
  data() {
    return {};
  },

  methods: {
    handleModalClose() {
      this.$emit("modalHidden", false);
    },
    async handleModalConfirm() {
      // console.log("handleModalConfirm: ", this.modalInfo);
      this.$emit("modalConfirm", true);
    },
  },
};
</script>

<style scoped>
.confirm-modal {
  width: 50%;
  height: auto;
  background: #2a2a2d;
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

.text-hight {
  color: #1da3c2;
  font-weight: bold;
}

.btn-confirm {
  background-color: #2a2a2d;
  border-radius: 24px;
  border: 1px solid #1da3c2;
  color: whitesmoke;
}

.btn-confirm:hover {
  background-color: #1da3c2;
  color: black;
  font-weight: bolder;
}

.btn-confirm-remove {
  background-color: #2a2a2d;
  border-radius: 24px;
  border: 1px solid red;
  color: whitesmoke;
}

.btn-confirm-remove:hover {
  background-color: red;
  color: black;
  font-weight: bolder;
}

@media only screen and (max-width: 390px) {
  .confirm-modal {
    width: 92%;
    height: 620px;
    background: #00305b;
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.1);
    border-radius: 14px;
    position: fixed;
    z-index: 2;
    top: calc(50% - 360px);
    left: calc(4%);
    padding: 12px;
    color: #c4c4c4;
  }
}
</style>