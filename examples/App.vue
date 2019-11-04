<template>
  <div id="app">
    <BpmnModeler v-model="modeler"></BpmnModeler>
    <!-- <BpmnViewer :xmlData="propXmlData" :taskData="propTaskList"></BpmnViewer> -->
  </div>
</template>
<script>
import demo from './demo.bpmn';
export default {
  data() {
    return {
      propXmlData: demo,
      propTaskList: ['UserTask_06zjapk'],
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
