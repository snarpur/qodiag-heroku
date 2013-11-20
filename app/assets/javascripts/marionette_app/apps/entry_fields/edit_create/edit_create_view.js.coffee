@Qapp.module "EntryFieldsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->
  
  class EditCreate.Layout extends App.Views.Layout
    template: "entry_fields/edit_create/templates/layout"
    
    regions:
      fieldTypeRegion: "#field-type-region"
      fieldConfig: "#field-config-region"

  class EditCreate.FieldTypeOption extends App.Views.ItemView
    template: "entry_fields/edit_create/templates/field_type_options"
    tagName: "option"

  class EditCreate.FieldType extends App.Views.CompositeView
    itemView: EditCreate.FieldTypeOption
    template: "entry_fields/edit_create/templates/field_type"
    itemViewContainer: "select#field-type"

    templateHelpers: =>
      isDisabled:=>
        if @model.get('id')?     
          "disabled"

    bindings:
      '#field-type' : 'field_type'

    onShow:->
      @.stickit()
      
    triggers:
      "change select":"fieldtype:change"     

  class EditCreate.TextFieldType extends App.Views.ItemView
    template: "entry_fields/edit_create/templates/text_field_type"
    bindings:
      '#title' : 'title',
      '#description' : 'description',
      '#visibility' : 'visibility'

    onShow:->
      @.stickit()
  
  class EditCreate.MultipleChoiceFieldItem extends App.Views.ItemView
    template: "entry_fields/edit_create/templates/multiple_choice_item"

    triggers:
      "click .destroy":"destroy-option:clicked"

    bindings:
      '.text_option' : 'text_option'

    onShow:->
      @.stickit()

  class EditCreate.MultipleChoiceFieldList extends App.Views.CompositeView
    itemView: EditCreate.MultipleChoiceFieldItem
    template: "entry_fields/edit_create/templates/multiple_choice"
    itemViewContainer: ".options"

    bindings:
      '#title' : 'title'

    onShow:->
      @.stickit()

    triggers:
      "click .add":"add-option:clicked"
      
   




    
