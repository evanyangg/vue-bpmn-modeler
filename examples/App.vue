<template>
  <div id="app">
    <BpmnModeler v-model="demo"></BpmnModeler>
  </div>
</template>
<script>
export default {
  data() {
    return {
      demo: {}
    }
  },
  watch: {
    demo (val) {
      console.log(val)
    }
  }
}
</script>
<style lang="less">
</style>
