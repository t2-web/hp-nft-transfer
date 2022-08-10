<template></template>

<script>
export default {
  name: "IndexPage",
  mounted() {
    const path = window.location.pathname;
    if (path === "/") {
      this.$router.push("/nftTransfer");
    }
  },
};
</script>