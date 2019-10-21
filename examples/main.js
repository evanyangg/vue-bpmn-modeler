import Vue from "vue";
import App from "./App.vue";
import BpmnModeler from '../packages/index'
Vue.use(BpmnModeler)
Vue.config.productionTip = false;
new Vue({
  render: h => h(App)
}).$mount("#app");
