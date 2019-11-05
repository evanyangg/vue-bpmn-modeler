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
![viewer](https://image.ulitom.com/other/viewer.png "todo task")
![viewer](https://image.ulitom.com/other/viewer-complete.png "completed task")
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