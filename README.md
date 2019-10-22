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