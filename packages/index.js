import BpmnModeler from './BpmnModeler.vue'
const components = [
  BpmnModeler
]

const install = function (Vue) {
  if (install.installed) return
  install.installed = true
  components.map(component => {
    Vue.component(component.name, component)
  })
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(BpmnModeler)
  install(window.Vue)
}
export default {
  install,
  BpmnModeler
}