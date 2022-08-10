<template>
  <div class="mx-2">
    <div class="row mx-md-3">
      <div class="col-12 d-flex flex-row justify-content-start">
        <div class="page-title">Send Token</div>
      </div>
    </div>
    <div class="row mx-md-3 mt-4">
      <div class="col d-flex flex-row justify-content-start">
        <div class="main-title">{{ titleLeft }}</div>
      </div>
      <div class="col d-flex flex-row justify-content-start">
        <div class="main-title">{{ titleRight }}</div>
      </div>
    </div>
    <div class="row mx-md-3 mt-2">
      <div class="col-12 d-flex flex-row justify-content-start">
        <div class="custom-control custom-radio">
          <input
            type="radio"
            id="same"
            name="customRadio"
            class="custom-control-input"
            v-model="selectedNFTType"
            value="ERC721"
          />
          <label class="custom-control-label" for="same">NFT - ERC721</label>
        </div>
        <div class="ml-5 custom-control custom-radio">
          <input
            type="radio"
            id="different"
            name="customRadio"
            class="custom-control-input"
            v-model="selectedNFTType"
            value="ERC1155"
          />
          <label class="custom-control-label" for="different"
            >NFT - ERC1155</label
          >
        </div>
      </div>
    </div>
    <div class="row mx-md-3">
      <div class="col-12 col-md-6">
        <AddableList
          class="mt-2"
          label="NFT Smart contract address"
          :initSelect="selectedIndex"
          :listItem="constractList"
          :addBtnStatus="addBtnStatus"
          :removeBtnStatus="removeBtnStatus"
          @selectedItem="selectedHandler"
          @addItem="addItemHandler"
          @removeItem="removeItemHandler"
        />
      </div>
      <div class="col-12 col-md-6">
        <NFTTextArea
          class="mt-2"
          :nftType="selectedNFTType"
          :textValue="listReceiver"
          @textChange="changeHandler"
          @lostFocus="lostFocusHandler"
        />
      </div>
    </div>
    <div class="row m-4">
      <div class="col-12 d-flex justify-content-center pr-4">
        <div
          v-if="sendBtnStatus === 1"
          class="btn btn-sending w-50 py-2"
          type="button"
          disabled
        >
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
        </div>
        <div
          v-else-if="sendBtnStatus === 2"
          class="btn btn-send-active w-50 py-2"
          v-on:click="sendHandler"
        >
          Send
        </div>
        <div v-else class="btn btn-send w-50 py-2">Send</div>
      </div>
    </div>
    <ConfirmModal
      v-show="modalVisible"
      @modalHidden="toogleModal"
      @modalConfirm="confirmHandler"
      :modalInfo="modalInfo"
    />
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  validAddress,
  duplicateCheck,
  shortenString,
  csvTextToList,
} from "@/utils";

export default {
  layout: "default",
  loading: true,
  transition: "fade",
  scrollToTop: true,
  data() {
    return {
      titleLeft: "Text will be included",
      titleRight: "Text will be included",
      selectedNFTType: "ERC721",
      listReceiver: "",
      selectedIndex: 0,
      constractList: [],
      modalVisible: false,
      addBtnStatus: 0,
      removeBtnStatus: 0,
      sendBtnStatus: 0,
      modalInfo: {
        modalMode: 0,
        modalTitle: "",
        inputSCAddress: "",
      },
      listAddress: [],
      listTokenId: [],
      listAmounts: [],
    };
  },
  computed: {
    accountAddress() {
      return this.getAccount();
    },
    explorerUrl() {
      const netID = this.getNetID();
      if (netID === 97 || netID === "97") {
        return "https://testnet.bscscan.com";
      } else if (netID === 4 || netID === "4") {
        return "https://rinkeby.etherscan.io";
      } else if (netID === 56 || netID === "56") {
        return "https://bscscan.com";
      } else if (netID === 1 || netID === "1") {
        return "https://etherscan.io";
      } else {
        return "";
      }
    },
  },
  async mounted() {
    try {
      const tempAcc = await this.getAccount();
      // console.log("tempAcc: ", tempAcc);

      if (!tempAcc) {
        return;
      }

      this.constractList = await this.getItems(tempAcc, this.selectedNFTType);
      this.selectedIndex = this.constractList.length
        ? this.constractList.length - 1
        : 0;
    } catch (ex) {
      console.log("Mounted error : ", ex);
      localStorage.removeItem("nftSCAddresses");
      // Back to home
      this.$router.push({
        path: "/",
      });
    }
  },
  watch: {
    // whenever question changes, this function will run
    async selectedNFTType(newSelectedNFTType, oldSelectedNFTType) {
      // console.log("oldSelectedNFTType : ", oldSelectedNFTType);
      // console.log("newSelectedNFTType : ", newSelectedNFTType);

      if (!this.accountAddress) {
        return;
      }

      this.constractList = await this.getItems(
        this.accountAddress,
        newSelectedNFTType
      );
    },
  },
  methods: {
    ...mapGetters("web3", ["getAccount", "getNetID"]),
    ...mapActions("erc721", ["erc721ApproveForAll", "erc721Info", "ownerOf"]),
    ...mapActions("erc1155", [
      "erc1155ApproveForAll",
      "erc1155Info",
      "balanceOf",
    ]),
    ...mapActions("nftTransfer", ["transferNFTToReceivers"]),

    toogleModal(modal) {
      this.modalVisible = modal;
    },
    async addItemHandler(addParams) {
      if (this.modalVisible) return;
      if (!this.accountAddress) {
        this.$toast.error("Please connect a wallet first!");
        return;
      }

      const isValidAddres = await validAddress(addParams.itemValue);
      if (!isValidAddres) {
        this.$toast.error("Please enter NFT token address");
        return;
      }

      const contractAddressList = this.constractList.map(
        (oneItem) => oneItem.SCAddress
      );
      const duplycateResult = await duplicateCheck(
        contractAddressList,
        addParams.itemValue
      );
      // console.log("duplycateResult: ", duplycateResult);

      if (duplycateResult) {
        this.$toast.error(
          `Already exist the contract at ${shortenString(addParams.itemValue)}`
        );
        return;
      }

      // Prepare modal info
      if (this.selectedNFTType === "ERC721") {
        const erc721Info = await this.erc721Info({
          nftAddress: addParams.itemValue,
          from: this.accountAddress,
        });

        // console.log("erc721Info: ", erc721Info);
        if (!erc721Info.balance || !erc721Info.name) {
          this.$toast.error(
            `Can not get NFT Info at ${shortenString(addParams.itemValue)}`
          );

          return;
        }

        this.modalInfo = {
          modalMode: 1,
          modalTitle: "Add an NFT contract address",
          content: "Are you sure to add the NFT contract",
          inputSCAddress: addParams.itemValue,
          balance: erc721Info.balance,
          nftName: erc721Info.name,
        };
      } else {
        const erc1155Info = await this.erc1155Info({
          nftAddress: addParams.itemValue,
          from: this.accountAddress,
        });

        // console.log("erc1155Info: ", erc1155Info);
        if (!erc1155Info) {
          this.$toast.error(
            `Can not get NFT Info at ${shortenString(addParams.itemValue)}`
          );

          return;
        }

        this.modalInfo = {
          modalMode: 1,
          modalTitle: "Add an NFT contract address",
          content: "Are you sure to add the NFT contract",
          inputSCAddress: addParams.itemValue,
          balance: "NA",
          nftName: "NA",
        };
      }
      this.toogleModal(true);
    },
    async removeItemHandler(removeParams) {
      // console.log("removeItemHandler: ", removeParams);
      // console.log("addItemHandler: ", this.accountAddress);
      if (!this.accountAddress) {
        this.$toast.error("Please connect a wallet first!");
        return;
      }

      if (this.modalVisible) return;

      if (this.constractList.length === 0) {
        this.$toast.error("List is already emplty");
        return;
      }

      if (!removeParams) {
        this.$toast.error("Please select one contract");
        return;
      }

      if (this.selectedNFTType === "ERC721") {
        const erc721Info = await this.erc721Info({
          nftAddress: this.constractList[removeParams.itemIndex].SCAddress,
          from: this.accountAddress,
        });

        this.modalInfo = {
          modalMode: 2,
          modalTitle: "Remove the NFT contract address",
          content: "Are you sure to remove the NFT contract",
          inputSCAddress: this.constractList[removeParams.itemIndex].SCAddress,
          balance: erc721Info.balance,
          nftName: erc721Info.name,
        };
      } else {
        const erc1155Info = await this.erc1155Info({
          nftAddress: this.constractList[removeParams.itemIndex].SCAddress,
          from: this.accountAddress,
        });

        // console.log("erc1155Info: ", erc1155Info);
        if (!erc1155Info) {
          this.$toast.error(
            `Can not get NFT Info at ${shortenString(
              this.constractList[removeParams.itemIndex].SCAddress
            )}`
          );

          return;
        }

        this.modalInfo = {
          modalMode: 2,
          modalTitle: "Remove the NFT contract address",
          content: "Are you sure to remove the NFT contract",
          inputSCAddress: this.constractList[removeParams.itemIndex].SCAddress,
          balance: "NA",
          nftName: "NA",
        };
      }
      this.toogleModal(true);
    },
    async confirmHandler() {
      this.toogleModal(false);
      if (this.modalInfo.modalMode === 1) {
        this.approveAll();
      } else {
        this.unApproveAll();
      }
    },
    async approveAll() {
      this.addBtnStatus = 1;
      let isApproved = false;
      if (this.selectedNFTType === "ERC721") {
        isApproved = await this.erc721ApproveForAll({
          nftAddress: this.modalInfo.inputSCAddress,
          setValue: true,
          from: this.accountAddress,
        });
      } else {
        isApproved = await this.erc1155ApproveForAll({
          nftAddress: this.modalInfo.inputSCAddress,
          setValue: true,
          from: this.accountAddress,
        });
      }
      // console.log("isApproved", isApproved);

      if (isApproved) {
        // Save new item
        this.constractList.push({
          SCAddress: this.modalInfo.inputSCAddress,
          isApproved: true,
        });
        await this.saveItem();
      }
      this.addBtnStatus = 0;
    },
    async unApproveAll() {
      this.removeBtnStatus = 1;
      let isApproved = true;
      // console.log("selectedNFTType", this.selectedNFTType);
      // console.log("inputSCAddress", this.modalInfo.inputSCAddress);

      if (this.selectedNFTType === "ERC721") {
        isApproved = await this.erc721ApproveForAll({
          nftAddress: this.modalInfo.inputSCAddress,
          setValue: false,
          from: this.accountAddress,
        });
      } else {
        isApproved = await this.erc1155ApproveForAll({
          nftAddress: this.modalInfo.inputSCAddress,
          setValue: false,
          from: this.accountAddress,
        });
      }
      // console.log("isApproved", isApproved);

      if (!isApproved) {
        this.constractList.splice(this.selectedIndex, 1);
        await this.saveItem();
      }
      this.removeBtnStatus = 0;
    },
    async saveItem() {
      try {
        // Get current Object
        var currentObj = await JSON.parse(
          localStorage.getItem(this.accountAddress)
        );
        // console.log("currentObj: ", currentObj);
        if (
          currentObj === null ||
          currentObj === undefined ||
          currentObj[this.accountAddress] === null ||
          currentObj[this.accountAddress] === undefined
        ) {
          // console.log("Create new currentObj: ", currentObj);

          currentObj = {};
          currentObj[this.accountAddress] = {
            ERC721: [],
            ERC1155: [],
          };
        }

        // Add updated list
        currentObj[this.accountAddress][this.selectedNFTType] =
          this.constractList;
        // console.log("Save currentObj: ", currentObj);

        const parsed = JSON.stringify(currentObj);
        localStorage.setItem(this.accountAddress, parsed);
      } catch (error) {
        console.log("saveItem error: ", error);
      }
    },
    async getItems(inAccAddress, inNFTType) {
      const savedList = await localStorage.getItem(inAccAddress);
      if (!savedList) {
        return [];
      }

      const allNFTList = await JSON.parse(savedList);
      // console.log("allNFTList: ", allNFTList);
      const tempContractList = allNFTList[inAccAddress][inNFTType];
      const result = tempContractList ? tempContractList : [];
      // console.log("constractList: ", result);
      return result;
    },
    async changeHandler(input) {
      this.listReceiver = input;
    },
    async lostFocusHandler() {
      // console.log("lostFocusHandler listReceiver: ", this.listReceiver);
      if (!this.listReceiver) {
        this.sendBtnStatus = 0;
        return;
      }

      this.listAddress = await csvTextToList(this.listReceiver, 0);
      this.listTokenId = await csvTextToList(this.listReceiver, 1, true);

      if (this.selectedNFTType === "ERC1155") {
        this.listAmounts = await csvTextToList(this.listReceiver, 2, true);
      }

      var checkListAddress = true;
      await Promise.all(
        this.listAddress.map((oneAddress) => {
          var tempResult = validAddress(oneAddress);
          if (!tempResult) {
            checkListAddress = false;
          }
        })
      );

      // console.log("lostFocusHandler checkListAddress: ", checkListAddress);
      if (!checkListAddress) {
        this.sendBtnStatus = 0;

        return;
      }

      // console.log("lostFocusHandler listTokenId: ", this.listTokenId);
      let index = this.listTokenId.findIndex(Number.isNaN);
      // console.log("lostFocusHandler index of NaN: ", index);
      if (this.listTokenId.length < 1 || index !== -1) {
        this.sendBtnStatus = 0;

        return;
      }

      if (this.selectedNFTType === "ERC1155") {
        // console.log("lostFocusHandler listAmounts: ", this.listAmounts);
        let indexAmount = this.listAmounts.findIndex(Number.isNaN);

        if (this.listAmounts.length < 1 || indexAmount !== -1) {
          this.sendBtnStatus = 0;

          return;
        }
      }

      this.sendBtnStatus = 2;
    },
    async selectedHandler(input) {
      this.selectedIndex = input.selectedIndex;
    },
    async validateOwner(inListTokenId, ownerAddress) {
      try {
        let bResult = true;
        // console.log("inListTokenId: ", inListTokenId);
        // console.log("ownerAddress: ", ownerAddress);
        // console.log(
        //   "nftAddress: ",
        //   this.constractList[this.selectedIndex].SCAddress
        // );

        let ownerList = await Promise.all(
          inListTokenId.map((aTokenId) =>
            this.ownerOf({
              nftAddress: this.constractList[this.selectedIndex].SCAddress,
              tokenId: aTokenId,
            })
          )
        );
        // console.log("ownerList: ", ownerList);
        // console.log("Loged in address: ", ownerAddress);

        await Promise.all(
          ownerList.map((anAddress, index) => {
            if (anAddress == "") {
              this.$toast.error(
                `The token Id ${inListTokenId[index]} is not existing!`
              );
              bResult = false;
            }
            // console.log("anAddress in list: ", anAddress.toLowerCase());

            if (ownerAddress != anAddress.toLowerCase()) {
              this.$toast.error(
                `The token Id ${inListTokenId[index]} is not yours!`
              );

              bResult = false;
            }
          })
        );

        return bResult;
      } catch (err) {
        console.log("validateOwner error: ", err);
      }
    },
    async validateBalance1155(inListTokenId, ownerAddress) {
      try {
        let bResult = true;
        // console.log("inListTokenId: ", inListTokenId);
        // console.log("ownerAddress: ", ownerAddress);
        // console.log("selectedIndex: ", this.selectedIndex);
        // console.log("constractList: ", this.constractList);

        let ownerBalanceList;
        ownerBalanceList = await Promise.all(
          inListTokenId.map((aTokenId) =>
            this.balanceOf({
              from: this.accountAddress,
              nftAddress: this.constractList[this.selectedIndex].SCAddress,
              tokenId: aTokenId,
            })
          )
        );
        // console.log("ownerBalanceList: ", ownerBalanceList);

        await Promise.all(
          ownerBalanceList.map((oneBalance, index) => {
            if (
              oneBalance == "" ||
              oneBalance == "0" ||
              !Number.parseInt(oneBalance)
            ) {
              this.$toast.error(
                `The token Id ${inListTokenId[index]} is empty blance!`
              );
              bResult = false;
            }
          })
        );

        return bResult;
      } catch (err) {
        console.log("validateBalance1155 error:", err);
      }
    },
    async sendHandler() {
      try {
        // console.log("sendHandler accountAddress: ", this.accountAddress);
        if (!this.accountAddress) {
          this.$toast.error("Please connect a wallet first!");
          return;
        }

        this.sendBtnStatus = 1;

        // console.log("sendHandler listTokenId: ", this.listTokenId);
        // console.log(
        //   "sendHandler SCAddress: ",
        //   this.constractList[this.selectedIndex].SCAddress
        // );
        if (this.selectedNFTType === "ERC721") {
          const checkTokenIdOwner = await this.validateOwner(
            this.listTokenId,
            this.accountAddress
          );

          if (!checkTokenIdOwner) {
            return;
          }
        } else {
          const checkTokenIdBalance = await this.validateBalance1155(
            this.listTokenId,
            this.accountAddress
          );

          if (!checkTokenIdBalance) {
            return;
          }
        }

        const result = await this.transferNFTToReceivers({
          from: this.accountAddress,
          tokenAddress: this.constractList[this.selectedIndex].SCAddress,
          NFTType: this.selectedNFTType === "ERC721",
          recipientsAddresses: this.listAddress,
          tokenIds: this.listTokenId,
          amounts: this.listAmounts,
        });

        // console.log("sendHandler result: ", result);
        if (result.isTransferred == false) {
          if (result.transactionHash) {
            this.$toast.error("Failed transaction");
          } else {
            this.$toast.error("User reject transaction");
          }
        }

        if (result.transactionHash) {
          this.$toast.success(
            `NFTs are sent at: ${result.transactionHash.substring(
              0,
              6
            )}...${result.transactionHash.substring(
              result.transactionHash.length - 4
            )}`,
            {
              action: {
                text: "View",
                onClick: (e, toastObject) => {
                  window.open(
                    `${this.explorerUrl}/tx/${result.transactionHash}`,
                    "blank"
                  );
                },
              },
            }
          );

          this.listAddress = [];
          this.listTokenId = [];
          this.listAmounts = [];
          this.listReceiver = "";
        }
      } catch (e) {
        this.$toast.error("Send errors");
      } finally {
        this.sendBtnStatus = 0;
      }
    },
  },
};
</script>
<style scoped>
.page-title {
  color: white;
  font-weight: 700;
  font-size: 32px;
}

.main-title {
  color: white;
  font-weight: 700;
  font-size: 16px;
}
.custom-control-label {
  color: white;
  font-weight: bolder;
}

.custom-control-input:checked ~ .custom-control-label::before {
  border-color: #1da3c2 !important;
  background-color: #1da3c2 !important;
}

.custom-control-label::before {
  background-color: transparent;
  border-color: #1da3c2 !important;
}

.btn-send {
  background-color: #2a2a2d;
  border: none;
  color: #6f7273;
  border-radius: 24px;
}

.btn-send-active:hover {
  background-color: #1da3c2;
  color: black;
  border-radius: 24px;
  border: 1px solid #1da3c2;
  font-weight: bolder;
}

.btn-sending {
  background-color: #2a2a2d;
  border: none;
  color: #1da3c2;
  border-radius: 24px;
  border: 1px solid #1da3c2;
}

.btn-send-active {
  background-color: #2a2a2d;
  border: none;
  color: #1da3c2;
  border-radius: 24px;
  border: 1px solid #1da3c2;
}
</style>