<template>
  <div class="containers">
    <div ref="canvas" class="canvas"></div>
  </div>
</template>

<script>
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
export default {
  name: "BpmnViewer",
  props: {
    xmlData: {
      type: String,
      default: ''
    },
    taskData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      taskList: []
    };
  },
  mounted() {
    this.taskList = this.taskData
    let bpmnViewer = new BpmnViewer({ container: this.$refs["canvas"] });
    let _self = this;
    bpmnViewer.importXML(this.xmlData, function(err) {
      if (err) {
        console.log('加载失败', err);
      } else {
        let canvas = bpmnViewer.get('canvas');
        canvas.zoom('fit-viewport')
        if (_self.taskList && _self.taskList.length > 0) {
          let overlays = bpmnViewer.get('overlays');
          let overlayHtml = document.createElement('div');
          overlays.add('StartEvent_1', {
            position: {
              top: 0,
              left: 0
            },
            html: overlayHtml
          });
          
          _self.taskList.forEach(n => {
            overlays.add(n.key, {
                position: {
                  top: 0,
                  left: 0
                },
                html: overlayHtml
              });
            if (n.completed) {
              canvas.addMarker(n.key, 'highlight');
            } else {
              canvas.addMarker(n.key, 'highlight-todo');
            }
          });
          // 判断开始节点或结束节点完成
          bpmnViewer._definitions.rootElements[0].flowElements.forEach(n => {
            if (n.$type === 'bpmn:EndEvent') {
              n.incoming.forEach(nn => {
                let completeTask = _self.taskList.find(m => m.key === nn.sourceRef.id && m.completed)
                completeTask = true;
                if (completeTask) {
                  canvas.addMarker(n.id, 'highlight');
                  return
                }
              });
            } else if (n.$type === 'bpmn:StartEvent') {
              n.outgoing.forEach(nn => {
                let completeTask = _self.taskList.find(m => m.key === nn.targetRef.id && m.completed)
                completeTask = true;
                if (completeTask) {
                  canvas.addMarker(n.id, 'highlight');
                  return
                }
              });
            }
          })
        }
      }
    });
  }
};
</script>
<style lang="less" scoped>
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
/deep/.highlight:not(.djs-connection) .djs-visual > :nth-child(1) {
  fill: green !important; 
  stroke: green !important;
  fill-opacity: 0.2 !important;
}
/deep/.highlight:not(.djs-connection) .djs-visual > :nth-child(2) {
  fill: green !important;
}
/deep/.highlight-todo:not(.djs-connection) .djs-visual > :nth-child(1) {
  fill: orange !important; 
  stroke: orange !important;
  stroke-dasharray: 4px !important; 
  fill-opacity: 0.2 !important;
}
</style>