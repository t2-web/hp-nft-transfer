<template>
  <div>
    <div class="row mb-2">
      <div class="col label">{{ label }}</div>
    </div>
    <div class="row">
      <div class="col">
        <select
          :class="
            listItem.length == 0
              ? 'px-2 pt-2 pb-1 w-100 rounded cus-select'
              : 'px-2 pt-2 pb-3 w-100 rounded cus-select'
          "
          :size="listItem.length == 0 ? 15 : 8"
          @change="selectedHandler($event)"
        >
          <option
            class="py-2 cus-op"
            selected
            v-for="(item, index) in listItem"
            :key="index"
            :value="item.SCAddress"
          >
            <div v-if="item.SCAddress">
              <!-- {{ item.SCAddress }} -->
              {{
                `${item.SCAddress.substring(
                  0,
                  12
                )}...${item.SCAddress.substring(item.SCAddress.length - 10)}`
              }}
            </div>
            <div class="badge badge-primary badge-pill">
              {{ item.isApproved ? "Approved" : "Not approved" }}
            </div>
          </option>
        </select>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-12 col-md-8">
        <input
          type="text"
          id="title"
          class="form-control cus-input"
          v-model="inputSCAddress"
          placeholder="0xF0a461322c1e7383fF1b73c886e073392896eb65"
        />
      </div>
      <div
        class="
          col-6
          mt-2
          col-md-4
          mt-md-0
          d-flex
          justify-content-between justify-content-md-end
        "
      >
        <div
          v-if="addBtnStatus"
          class="btn px-2 btn-add-wait"
          type="button"
          disabled
        >
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
        </div>
        <div v-else class="btn btn-add" v-on:click="addItem">Add</div>
        <div
          v-if="removeBtnStatus"
          class="btn px-2 btn-removing"
          type="button"
          disabled
        >
          <span
            class="spinner-border spinner-border-sm spinner-cus"
            role="status"
            aria-hidden="true"
          ></span>
        </div>
        <div v-else class="btn px-4 ml-2 btn-remove" v-on:click="removeItem">
          Remove
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "AddableList",
  props: ["label", "listItem", "initSelect", "addBtnStatus", "removeBtnStatus"],
  data() {
    return {
      inputSCAddress: "",
      selectedIndexAddress: 0,
    };
  },
  computed: {
    accAddress() {
      return this.getAccount();
    },
  },
  mounted() {},
  methods: {
    async selectedHandler(input) {
      this.selectedIndexAddress = input.target.selectedIndex;
      this.inputSCAddress = input.target.value;
      this.$emit("selectedItem", {
        value: input.target.value,
        selectedIndex: input.target.selectedIndex,
      });
    },
    async addItem() {
      this.$emit("addItem", {
        itemValue: this.inputSCAddress,
        itemIndex: this.selectedIndexAddress,
      });
    },
    async removeItem() {
      this.$emit("removeItem", {
        itemValue: this.inputSCAddress,
        itemIndex: this.selectedIndexAddress,
      });
    },
  },
};
</script>
<style scoped>
.label {
  color: #838182;
}

.cus-select {
  background-color: #2a2a2d;
  border: none;
  color: #6f7273;
  height: 40vh;
}

.cus-select:focus {
  outline: none;
}

.cus-op {
  height: 35px;
}

.cus-input {
  background-color: #2a2a2d;
  border: none;
  color: #6f7273;
  font-size: smaller;
}

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px black;
}

::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px black;
}

input:hover,
input:active,
input:focus {
  outline: 0px !important;
  -webkit-appearance: none;
  box-shadow: none !important;
  border: 1px solid #1da3c2;
  color: whitesmoke;
}

.btn-add {
  background-color: #2a2a2d;
  border: none;
  color: #1da3c2;
  border-radius: 24px;
  border: 1px solid #1da3c2;
  font-size: small;
  min-width: 68px;
}

.btn-add-wait {
  background-color: #2a2a2d;
  border: none;
  color: #1da3c2;
  border-radius: 24px;
  border: 1px solid #1da3c2;
  min-width: 68px;
  font-size: small;
}

.btn-add:hover {
  background-color: #1da3c2;
  border: none;
  color: black;
  border-radius: 24px;
  border: 1px solid #1da3c2;
  font-weight: bolder;
}

.btn-remove {
  background-color: #2a2a2d;
  border: none;
  color: red;
  border-radius: 24px;
  border: 1px solid red;
  font-size: small;
  min-width: 100px;
}

.btn-remove:hover {
  background-color: red;
  color: black;
  border-radius: 24px;
  border: 1px solid red;
  font-weight: bolder;
}

.btn-removing {
  background-color: #2a2a2d;
  border: none;
  color: #1da3c2;
  border-radius: 24px;
  border: 1px solid red;
  font-size: small;
  min-width: 80px;
  margin-left: 8px;
}

.spinner-cus {
  border: 0.25em solid red;
  border-right-color: transparent;
}

option {
  border-radius: 4px;
  padding-left: 8px;
}
option:checked {
  color: #1da3c2 !important;
  background-color: #6f7273;
}
</style>