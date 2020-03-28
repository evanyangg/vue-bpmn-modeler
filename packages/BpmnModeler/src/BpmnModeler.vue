<template>
  <div ref="container" class="containers" @mousemove="focusOut">
    <div ref="canvas" class="canvas"></div>
  </div>
</template>

<script>
import BpmnModeler from "../../CustomModeler";
import CustomTranslate from "../../CustomTranslate";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import minimapModule from "diagram-js-minimap";
import CliModule from 'bpmn-js-cli';
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
      svgImage: "",
      isSvg: false
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
        minimapModule,
        CliModule
      ],
      cli: {
        bindTo: 'cli'
      },
      moddleExtensions: {
        camunda: camundaModdleDescriptor
      }
    });
    this.$nextTick(() => {
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
    })
  },
  methods: {
    async replace(data) {
      let _self = this;
      await this.openDiagram(this.diagramXML);
      let incomingTask = []
      let outgoingTask = []
      return new Promise((resolve) => {
        if (data && data.taskList.length > 0) {
          let modelerCanvas = _self.modeler.get("canvas");
          let rootElement = modelerCanvas.getRootElement();
          let cli = window.cli;
          let activityType = ''
          // 删除目标task sequenceFlow
          rootElement.children.forEach(n => {
            if (n.id === data.replaceActivity) {
              if (n.type === 'bpmn:SequenceFlow') {
                incomingTask.push(n.source.id)
                outgoingTask.push(n.target.id)
              } else {
                n.incoming.forEach(nn => {
                  incomingTask.push(nn.source.id)
                })
                n.outgoing.forEach(nn => {
                  outgoingTask.push(nn.target.id)
                })
              }
              activityType = n.type
            }
          })
          let taskActivity = activityType === 'bpmn:SequenceFlow' ? incomingTask[0] : data.replaceActivity
          for (let index = 0; index < data.taskList.length; index++) {
            taskActivity = cli.append(taskActivity, 'bpmn:UserTask')
            data.taskList[index].taskActivity = taskActivity;
            cli.setLabel(taskActivity, data.taskList[index].label);
            cli.move(taskActivity, { x: -200, y: 120 });
          }
          activityType === 'bpmn:SequenceFlow' ? cli.removeConnection(data.replaceActivity) : cli.removeShape(data.replaceActivity)
          incomingTask.forEach(n => {
            cli.connect(n, data.taskList[0].taskActivity, 'bpmn:SequenceFlow') 
          })
          outgoingTask.forEach(n => {
            cli.connect(data.taskList[data.taskList.length - 1].taskActivity, n, 'bpmn:SequenceFlow') 
          })
          resolve(data.taskList);
        } else {
          this.openDiagram(this.diagramXML);
        }
      })
    },
    openDiagram(xml) {
       return new Promise((resolve, reject) => { 
        if (xml) {
          this.modeler.importXML(xml, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve()
            }
          });
          this.xmlData = xml;
        } else {
          this.modeler.createDiagram();
          setTimeout(() => {
            /**
             * 修改xml属性值 isExecutable = false => true
             * isExecutable = false 后端部署流程时 不会创建流程定义数据
             */
            let modelerCanvas = this.modeler.get("canvas");
            let rootElement = modelerCanvas.getRootElement();
            let modeling = this.modeler.get("modeling");
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
            resolve();
          });
        }
      })
    },
    saveSVG(done) {
      this.modeler.saveSVG(done);
    },
    saveDiagram(done) {
      this.modeler.saveXML({ format: true }, function(err, xml) {
        done(err, xml);
      });
    },
    focusOut(event) {
      let layerBase = document.querySelector('.layer-base')
      let zoom = layerBase.parentNode.getBoundingClientRect();
      if (event.pageX < zoom.left || event.pageX > (zoom.left + zoom.width + 100) || event.pageY < zoom.top || event.pageY > (zoom.top + zoom.height + 40)) {
        // 鼠标移出编辑区域 完成输入 并 失去焦点
        let directEditing = this.modeler.injector.get('directEditing', false);
        directEditing.complete()
        let eventBus = this.modeler.injector.get('eventBus', false);
        eventBus.fire('element.click', '')
      }
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