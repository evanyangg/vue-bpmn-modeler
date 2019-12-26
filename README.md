# vue-bpmn-modeler

Design BPMN 2.0 modeler in a [Vue.js](https://vuejs.org) application based on  [bpmn-js](https://github.com/bpmn-io/bpmn-js).

## Usage
```bash
yarn add vue-bpmn-modeler
```
```js
# main.js
import VueBpmnModeler from "vue-bpmn-modeler";
import "vue-bpmn-modeler/lib/vue-bpmn-modeler.css";
Vue.use(VueBpmnModeler);
```
![viewer](https://image.ulitom.com/other/modeler.png)

组件会显示设计器，参数 v-model="modeler"，会通过画图操作实时返回对应的xml数据和svg数据，用于保存初始化的模板。
```html
<template>
  <BpmnModeler v-model="modeler"></BpmnModeler>
</template>

<script>
  export default {
    name: "BpmnModeler",
    props: {
      diagramXML: String
    },
    watch: {
      diagramXML(val) {
        this.openDiagram(val)
      }
    },
    data() {
      modeler: {
        // 模型xml数据
        // model xml data
        xmlData: "",
        // svg图片数据
        // svg data
        svgImage: ""
      }
    },
    // 详细代码请参考源码
    // see source code for detail
    mounted() {
    },
    methods: {

      openDiagram(xml) {
        if (xml) {
          this.modeler.importXML(xml, function(err) {
            if (err) {
              console.error(err);
            } else {
            }
          });
          this.xmlData = xml;
        } else {
          this.modeler.createDiagram();
          let _self = this;
          setTimeout(() => {
            /**
             * 修改xml属性值 isExecutable = false => true
             * isExecutable = false 后端部署流程时 不会创建流程定义数据
             */
            let modelerCanvas = _self.modeler.get("canvas");
            let rootElement = modelerCanvas.getRootElement();
            let modeling = _self.modeler.get("modeling");
            // modeling.updateProperties(rootElement, {
            //   // isExecutable: true
            // });
            // 设定开始节点名称和结束节点名称
            // set StartEvent name 'start' and EndEvent name 'end'
            rootElement.children.forEach(n => {
              if (n.type === 'bpmn:StartEvent') {
                modeling.updateProperties(n, {
                  name: '开始',
                });
              } else if (n.type === 'bpmn:EndEvent') {
                modeling.updateProperties(n, {
                  name: '结束',
                });
              }
            })
          });
        }
      }
    }
  };
</script>
```
#### 当流程启动时，流程会默认走到第一个节点 提交申请，此时的待办任务会显示橙色。
#### When the process starts, the process will complete first task by default, and the TODO tasks will be orange.
![viewer](https://image.ulitom.com/other/viewer.png "todo task")
#### 当流程完成 提交申请 且满足 条件1 时，流程会走到 成本中心 节点，此时已经完成的待办任务会显示绿色。
#### when the first task completed and met condition 1, the process coming to 'costcenter' task, Completed tasks displayed in green.
![viewer](https://image.ulitom.com/other/viewer-completed.png "completed task")

参数介绍：
xmlData: 表示流程图的xml数据
taskList: 表示流程的历史记录 可以通过服务的接口 historyService 获得
```html
<template>
  <BpmnViewer :xmlData="xmlData" :taskData="taskList"></BpmnViewer>
</template>

<script>
  export default {
    data() {
      modeler: {
        // 模型xml数据
        xmlData: "",
        // 任务列表
        taskList: [{
          // 任务定义的key
          "key": "",
          // 任务是否完成
          "completed": true
        }]
      }
    }
  };
</script>
```
#### 动态添加任务节点
#### dynamically add task
![viewer](https://image.ulitom.com/other/add-task.gif)
```javascript
addTask () {
  let taskAdd = {
    // 上一个节点
    source: 'UserTask_06zjapk',
    // 上一个节点箭头
    sourceSequenceFlow: 'SequenceFlow_1l3hfbd',
    // 下一个节点
    target: 'ExclusiveGateway_13yj8os',
    taskList: [
      {
        label: 'test task'
      }
    ]
  }
  this.$refs.modeler.addTask(taskAdd).then((taskList) => {
    // new task list
    console.log(taskList);
  });
}
```

## Examples
```bash
# clone the project
git clone https://github.com/evanyangg/vue-bpmn-modeler.git

# enter the project directory
cd vue-bpmn-modeler

# install dependencies
yarn

# serve with hot reload at localhost:8080
yarn serve
```
## License

MIT
