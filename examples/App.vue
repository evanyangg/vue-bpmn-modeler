<template>
  <div id="app">
    <BpmnModeler ref='modeler' v-model="modeler" :diagramXML="propXmlData"></BpmnModeler>
    <!-- <BpmnViewer :xmlData="viewData" :taskData="propTaskList"></BpmnViewer> -->
    <button @click="addTask" v-if="$refs.modeler">add task</button>
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
      let taskList = []
      if (Math.round(Math.random()) === 0) {
        taskList = [
          {
            label: 'test task1'
          },
          {
            label: '通用节点'
          }
        ]
      } else {
        taskList = [
          // {
          //   label: 'test task1'
          // }
        ]
      }
      let addOrReplace = {
        replaceActivity: 'UserTask_0hkfnx2',
        taskList: taskList
      }
      this.$refs.modeler.replace(addOrReplace).then((data) => {
        // new task list
        console.log(data);
      });
    }
  }
}
</script>
<style lang="less">
button {
  position: absolute;
  right:15px;
  bottom:100px;
  height: 40px;
  width: 80px;
  z-index: 100;
  color: green;
  background: rgba(0, 128, 0, 0.2);
  border: 1px solid rgb(0, 128, 0);
  border-radius: 4px;
}
</style>
