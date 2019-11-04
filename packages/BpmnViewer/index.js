import BpmnViewer from './src/BpmnViewer.vue'
 
// 为组件提供 install 安装方法，供按需引入
BpmnViewer.install = function (Vue) {
  Vue.component(BpmnViewer.name, BpmnViewer)
}
 
// 默认导出组件
export default BpmnViewer