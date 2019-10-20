import BpmnModeler from './BpmnModeler.vue'

BpmnModeler.install = function (Vue) {
  Vue.component(BpmnModeler.name, BpmnModeler)
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(BpmnModeler)
}
export default BpmnModeler