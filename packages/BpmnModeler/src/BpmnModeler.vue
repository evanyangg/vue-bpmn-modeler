<template>
  <div ref="container" class="containers">
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
  data() {
    return {
      modeler: {},
      xmlData: "",
      svgImage: ""
    };
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

    this.modeler.createDiagram();

    // 500毫秒后自动保存当前模型设计
    let _self = this;
    let exportArtifacts = debounce(function() {
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
    openDiagram: function(xml) {
      let _self = this;
      this.modeler.importXML(xml, function(err) {
        if (err) {
          _self.modeler.get("minimap").open();
          console.error(err);
        } else {
          _self.modeler.get("minimap").open();
        }
      });
    },
    saveSVG(done) {
      this.modeler.saveSVG(done);
    },
    saveDiagram(done) {
      this.modeler.saveXML({ format: true }, function(err, xml) {
        done(err, xml);
      });
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