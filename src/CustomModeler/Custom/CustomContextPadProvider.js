import inherits from './node_modules/inherits'

import ContextPadProvider from './node_modules/bpmn-js/lib/features/context-pad/ContextPadProvider'

import { is } from './node_modules/bpmn-js/lib/util/ModelUtil'

import { assign, bind } from './node_modules/min-dash'

inherits(CustomContextPadProvider, ContextPadProvider)

CustomContextPadProvider.$inject = [
  'injector',
  'connect',
  'translate',
  'elementFactory'
]

export default function CustomContextPadProvider(injector, connect, translate, element) {
  injector.invoke(ContextPadProvider, this)

  var cached = bind(this.getContextPadEntries, this)
  var rules = this._rules
  var elementFactory = this._elementFactory
  var create = this._create
  var autoPlace = this._autoPlace
  var modeling = this._modeling
  var contextPad = this._contextPadt

  this.getContextPadEntries = function(element) {
    
    var actions = {}
    var businessObject = element.businessObject

    function startConnect(event, element, autoActivate) {
      connect.start(event, element, autoActivate)
    }

    function appendAction(type, className, title, options) {
      if (typeof title !== 'string') {
        options = title
        title = translate('Append {type}', { type: type.replace(/^bpmn:/, '') })
      }

      function appendStart(event, element) {
        var shape = elementFactory.createShape(assign({ type: type }, options))
        create.start(event, shape, {
          source: element
        })
      }

      var append = autoPlace
        ? function(event, element) {
            var shape = elementFactory.createShape(
              assign({ type: type }, options)
            )

            autoPlace.append(element, shape)
          }
        : appendStart

      return {
        group: 'model',
        className: className,
        title: title,
        action: {
          dragstart: appendStart,
          click: append
        }
      }
    }

    function removeElement(e) {
      modeling.removeElements([element])
    }

    function appendUserTask(event, element) {
      if (autoPlace) {
        const shape = elementFactory.createShape({ type: 'bpmn:UserTask' })

        autoPlace.append(element, shape)
      } else {
        appendUserTaskStart(event, element)
      }
    }

    function appendUserTaskStart(event) {
      const shape = elementFactory.createShape({ type: 'bpmn:UserTask' })

      create.start(event, shape, element)
    }

    // 定义开始节点 扩展的操作
    if (is(businessObject, 'bpmn:StartEvent')) {
      assign(actions, {
        'append.gateway': appendAction(
          'bpmn:ExclusiveGateway',
          'bpmn-icon-gateway-none',
          translate('Append Gateway')
        ),
        'append.user-task': appendAction(
          'bpmn:UserTask',
          'bpmn-icon-user-task',
          translate('Append UserTask')
        )
      })
    } else {
      if (is(businessObject, 'bpmn:ExclusiveGateway')) {
        assign(actions, {
          'append.user-task': appendAction(
            'bpmn:UserTask',
            'bpmn-icon-user-task',
            translate('Append UserTask')
          )
        })
      } else if (!is(businessObject, 'bpmn:EndEvent')) {
        assign(actions, {
          'append.end-event': appendAction(
            'bpmn:EndEvent',
            'bpmn-icon-end-event-none',
            translate('Append EndEvent')
          ),
          'append.gateway': appendAction(
            'bpmn:ExclusiveGateway',
            'bpmn-icon-gateway-none',
            translate('Append Gateway')
          ),
          'append.user-task': appendAction(
            'bpmn:UserTask',
            'bpmn-icon-user-task',
            translate('Append UserTask')
          )
        })
      }
    }
    if (!is(businessObject, 'bpmn:EndEvent')) {
      assign(actions, {
        connect: {
          group: 'connect',
          className: 'bpmn-icon-connection-multi',
          title: translate('Append Sequence'),
          action: {
            click: startConnect,
            dragstart: startConnect
          }
        }
      })
    }
    assign(actions, {
      delete: {
        group: 'edit',
        className: 'bpmn-icon-trash',
        title: translate('Remove'),
        action: {
          click: removeElement
        }
      }
    })
    return actions
  }
}
