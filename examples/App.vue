<template>
  <div id="app">
    <BpmnModeler v-model="modeler" :diagramXML="propXmlData"></BpmnModeler>
    <!-- <BpmnViewer :xmlData="propXmlData" :taskData="propTaskList"></BpmnViewer> -->
  </div>
</template>
<script>
import demo from './demo.bpmn';
export default {
  data() {
    return {
      propXmlData: demo,
      propTaskList: [
        {
          key: 'UserTask_06zjapk',
          completed: true
        },
        {
          key: 'UserTask_07cj5cp',
          completed: false
        }
      ],
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
