import BpmnModeler from './src/BpmnModeler.vue'
 
// 为组件提供 install 安装方法，供按需引入
BpmnModeler.install = function (Vue) {
  Vue.component(BpmnModeler.name, BpmnModeler)
}
 
// 默认导出组件
export default BpmnModeler