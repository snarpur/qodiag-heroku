Backbone.Form.Field::renderingContext = (schema, editor) -> 
  model = editor.model

  title = model.fieldTitle(@key)
  nestedTitle = 
    nestedTitle: model.nestedFieldTitle(@key)
  if schema.type == "Radio"
    _.each(schema.options,(item,index,list) -> 
      unless item.label.match(/[A-Z]/)
        item.label = model.fieldTitle(item.label)
    )


  opt=
    key: this.key
    id: editor.id
    type: schema.type
    title: title 
    typeClass: "type-#{schema.type.toLowerCase()}"
    editor: '<b class="bbf-tmp-editor"></b>'
    help: '<b class="bbf-tmp-help"></b>'
    error: '<b class="bbf-tmp-error"></b>'

  if editor?.hasNestedForm?
    opt.nestedTitle = Handlebars.compile(App.Templates.FormPartials.nestedTitle)(nestedTitle)
    opt.nestedClass = if _.isEmpty(opt.nestedTitle) then "" else 'nested-fields'

  opt
