// import PaletteProvider from 'bpmn-js/lib/features/palette'
/**
 * A palette that allows you to create BPMN _and_ custom elements.
 */
import {
  assign
} from 'min-dash';

export default function PaletteProvider(palette, create, elementFactory, translate) {

  this._create = create;
  this._elementFactory = elementFactory;
  this._translate = translate;
  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'translate'
];

PaletteProvider.prototype.getPaletteEntries = function(/*element*/) {

  var actions  = {},
      create = this._create,
      elementFactory = this._elementFactory,
      translate = this._translate


  function createAction(type, group, className, title, options) {

    function createListener(event) {
      var shape = elementFactory.createShape(assign({ type: type }, options));

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }

      create.start(event, shape);
    }

    var shortType = type.replace(/^bpmn:/, '');

    return {
      group: group,
      className: className,
      title: translate(title || 'Create ' + shortType),
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  assign(actions, {
    'create.start-event': createAction(
      'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none'
    ),
    'create.end-event': createAction(
      'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none'
    ),
    'create.exclusive-gateway': createAction(
      'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-xor'
    ),
    'create.user-task': createAction(
      'bpmn:UserTask', 'task', 'bpmn-icon-user-task'
    )
  });

  return actions;
};
