<template>
  <div class="text-area-container">
    <div class="row">
      <form class="col">
        <div class="form-group">
          <div class="label mb-2" for="exampleFormControlTextarea1">
            {{ areaTitle }}
          </div>
          <textarea
            class="form-control cus-text-area py-2"
            id="exampleFormControlTextarea1"
            rows="12"
            :placeholder="placeHolder"
            :value="textValue"
            @input="$emit('textChange', $event.target.value)"
            @mouseleave="$emit('lostFocus')"
          ></textarea>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  name: "NFTTextArea",
  props: ["textValue", "nftType"],
  computed: {
    areaTitle() {
      if (this.nftType === "ERC1155") {
        return "Receivers, NFT Ids, Amounts";
      } else {
        return "Receivers, NFT Ids";
      }
    },
    placeHolder() {
      if (this.nftType === "ERC1155") {
        return "0xF0a461322c1e7383fF1b73c886e073392896eb65, 12, 1000";
      } else {
        return "0xF0a461322c1e7383fF1b73c886e073392896eb65, 12";
      }
    },
  },
  data() {
    return {};
  },
  mounted() {
    // console.log("mounted: ", this.textValue);
  },
  methods: {},
};
</script>
<style scoped>
.label {
  color: #838182;
}
.text-area-container {
  width: 100%;
}

.cus-text-area {
  background-color: #2a2a2d;
  border: none;
  color: #6f7273;
  height: 40vh;
}

textarea::-webkit-scrollbar {
  width: 12px;
  background-color: black;
}

textarea::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px black;
  background-color: #2a2a2d;
}

textarea:hover,
textarea:active,
textarea:focus {
  outline: 0px !important;
  -webkit-appearance: none;
  box-shadow: none !important;
  color: whitesmoke;
  border: 1px solid #1da3c2;
}
</style>