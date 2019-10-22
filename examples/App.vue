<template>
  <div id="app">
    <BpmnModeler v-model="modeler"></BpmnModeler>
  </div>
</template>
<script>
export default {
  data() {
    return {
      modeler: {
        xmlData: "",
        svgImage: ""
      }
    }
  },
  watch: {
    modeler (val) {
      console.log(val)
    }
  }
}
</script>
<style lang="less">
</style>
