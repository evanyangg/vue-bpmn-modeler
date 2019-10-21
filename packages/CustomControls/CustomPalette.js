/**
 * 自定义工具栏
 */
export default class CustomPalette {
  constructor(create, elementFactory, palette, translate, actions) {
    this.create = create
    this.elementFactory = elementFactory
    this.translate = translate
    this.actions = actions
    palette.registerProvider(this)
    
  }

  getPaletteEntries() {
    const { create, elementFactory, translate, actions } = this

    // 自定义用户任务
    function createUserTask(event) {
      const shape = elementFactory.createShape({ type: "bpmn:UserTask" })
      create.start(event, shape)
    }

    return {
      "create.user-task": {
        group: "activity",
        className: "bpmn-icon-user-task",
        title: translate("Create UserTask"),
        action: {
          dragstart: createUserTask,
          click: createUserTask
        }
      }
    }
  }
}

CustomPalette.$inject = ["create", "elementFactory", "palette", "translate"]
