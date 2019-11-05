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

<BpmnModeler>组件会显示设计器，参数 v-model="modeler"，会通过画图操作实时返回对应的xml数据和svg数据，用于保存初始化的模板。
```html
<template>
  <BpmnModeler v-model="modeler"></BpmnModeler>
</template>

<script>
  export default {
    data() {
      modeler: {
        // 模型xml数据
        xmlData: "",
        // svg图片数据
        svgImage: ""
      }
    }
  };
</script>
```
#### 当流程启动时，流程会默认走到第一个节点 提交申请，此时的待办任务会显示橙色。
![viewer](https://image.ulitom.com/other/viewer.png "todo task")
#### 当流程完成 提交申请 且满足 条件1 时，流程会走到 成本中心 节点，此时已经完成的待办任务会显示绿色。
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