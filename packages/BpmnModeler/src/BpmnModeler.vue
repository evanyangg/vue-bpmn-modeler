<template>
  <div ref="container" class="containers" @mouseleave="focusOut">
    <div ref="canvas" class="canvas"></div>
  </div>
</template>

<script>
import BpmnModeler from "../../CustomModeler";
import CustomTranslate from "../../CustomTranslate";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import minimapModule from "diagram-js-minimap";
import { debounce } from "min-dash";
let customTranslateModule = {
  translate: ["value", CustomTranslate]
};
export default {
  name: "BpmnModeler",
  props: {
    diagramXML: String
  },
  data() {
    return {
      modeler: {},
      xmlData: "",
      svgImage: ""
    };
  },
  watch: {
    diagramXML(val) {
      this.openDiagram(val)
    }
  },
  mounted() {
    let canvas = this.$refs["canvas"];
    this.modeler = new BpmnModeler({
      container: canvas,
      additionalModules: [
        customTranslateModule,
        minimapModule
      ],
      moddleExtensions: {
        camunda: camundaModdleDescriptor
      }
    });
    this.openDiagram(this.diagramXML);
    // 自动保存当前模型设计
    let _self = this;
    let exportArtifacts = debounce(function() {

      _self.saveSVG(function(err, svg) {
        _self.svgImage = svg;
      });

      _self.saveDiagram(function(err, xml) {
        _self.xmlData = xml;
      });
      let modelInfo = {
        xmlData: _self.xmlData,
        svgImage: _self.svgImage
      }
      _self.$emit('input', modelInfo)
    }, 10);
    this.modeler.on("commandStack.changed", exportArtifacts);
    exportArtifacts()
  },
  methods: {
    openDiagram(xml) {
      if (xml) {
        this.modeler.importXML(xml, function(err) {
          if (err) {
            console.error(err);
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
    },
    saveSVG(done) {
      this.modeler.saveSVG(done);
    },
    saveDiagram(done) {
      this.modeler.saveXML({ format: true }, function(err, xml) {
        done(err, xml);
      });
    },
    focusOut() {
      // 鼠标移出编辑区域 完成输入 并 失去焦点
      let directEditing = this.modeler.injector.get('directEditing', false);
      directEditing.complete()
      let eventBus = this.modeler.injector.get('eventBus', false);
      eventBus.fire('element.click', '')
    }
  }
};
</script>
<style lang="less" scoped>
@import "~bpmn-js/dist/assets/diagram-js.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "~diagram-js-minimap/assets/diagram-js-minimap.css";
.containers {
  position: absolute;
  background-color: #ffffff;
  top:0;
  left: 0;
  width: 100%;
  height: 100%;
}
.canvas {
  width: 100%;
  height: 100%;
}
</style>