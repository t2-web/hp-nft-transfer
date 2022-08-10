<template>
  <div class="root-style">
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Mulish"
    />
    <Header />
    <div class="body-main">
      <Nuxt class="content-container" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
.root-style {
  background-color: #000000;
  min-height: 100vh;
}
.content-container {
  width: 100%;
  padding-bottom: 32px;
  max-width: 1160px;
}

.body-main {
  display: flex;
  top: 106px;
  width: 100%;
  justify-content: center;
}
</style>