import Modeler from './node_modules/bpmn-js/lib/Modeler'

import inherits from './node_modules/inherits'

import CustomModule from './Custom'

export default function CustomModeler(options) {
  Modeler.call(this, options)

  this._customElements = []
}

inherits(CustomModeler, Modeler)

CustomModeler.prototype._modules = [].concat(CustomModeler.prototype._modules, [
  CustomModule
])
