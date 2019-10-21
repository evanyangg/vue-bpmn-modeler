import Modeler from 'bpmn-js/lib/Modeler'

import inherits from 'inherits'

import CustomModule from './Custom'

export default function CustomModeler(options) {
  Modeler.call(this, options)

  this._customElements = []
}

inherits(CustomModeler, Modeler)

CustomModeler.prototype._modules = [].concat(CustomModeler.prototype._modules, [
  CustomModule
])
