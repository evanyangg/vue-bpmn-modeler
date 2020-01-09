<template>
  <div id="app">
    <!-- <BpmnModeler ref='modeler' v-model="modeler" :diagramXML="propXmlData"></BpmnModeler> -->
    <BpmnViewer :xmlData="viewData" :taskData="propTaskList"></BpmnViewer>
    <!-- <button @click="addTask" style="position: absolute;top:50%;left:50%;width:200px;z-index: 2000;">add task</button> -->
  </div>
</template>
<script>
import demo from './demo.bpmn';
import view from './view.bpmn';
export default {
  data() {
    return {
      propXmlData: demo,
      viewData: view,
      propTaskList: [
        {
          key: 'UserTask_06zjapk',
          completed: true
        },
        {
          key: 'UserTask_07cj5cp',
          completed: true
        },
        {
          key: 'UserTask_0hkfnx2',
          completed: true
        },
        {
          key: 'UserTask_1pvvtgn',
          completed: true
        },
        {
          key: 'Task_02tadrd',
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
  },
  methods: {
    test (list) {
      console.log(list);
    },
    addTask () {
      let taskAdd = {
        source: 'UserTask_07cj5cp',
        replaceTaskActivity: 'UserTask_0hkfnx2',
        target: 'UserTask_1pvvtgn',
        taskList: [
          {
            label: 'test task1'
          },
          {
            label: 'test task2'
          }
        ]
      }
      this.$refs.modeler.addTask(taskAdd).then((data) => {
        // new task list
        console.log(data);
      });
    }
  }
}
</script>
<style lang="less" scoped>
.zhinengkan {
  position: absolute;
  top:0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
</style>
