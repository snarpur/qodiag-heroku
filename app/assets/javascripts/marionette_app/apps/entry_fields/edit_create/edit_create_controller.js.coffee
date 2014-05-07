@Qapp.module "EntryFieldsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->
  
  class EditCreate.Controller extends App.Controllers.Base

    initialize:(options)->
      {@activeView,@collection,@model} = options

    create:-> 
      @showDialog(new App.Entities.EntryField({editable: true, field_type: "text"}))
      
    edit:->
      @showDialog(@model)

    showDialog:(field)->

      @getFormWrapperView(field)
      @getSelectFieldTypeView(field)
      @getSelectedView(field)

      @listenTo field, "created", (options) =>  
        @addAsSorted(field, @collection)
        @formView.trigger("dialog:close")
        toastr.success("Spurningu bætt við", field.get('title'))

      @listenTo field, "updated", (options) =>
        @formView.trigger("dialog:close")

    getFormWrapperView: (field)->
      @formView = App.request "form:wrapper", @getLayout(field), @buttonsConfig(field)
      App.dialogRegion.show @formView


    getSelectedView: (field)->
      if field.get("field_type") is "text" or field.get("field_type") is "string"
        @getTextFieldView(field)
      else
        @addOptionCollection(field)
        @getMultiChoiceFieldView(field)

    getSelectFieldTypeView: (field)->
      selectView = new EditCreate.FieldType model: field, collection: new Backbone.Collection([{name: "text"}, 
        {name: "multi-choice"}, {name: "single-choice"}, {name: "string"}])
      @getFieldTypeRegion(field).show selectView

      @listenTo selectView, "fieldtype:change", (options) =>
        value = options.view.$el.find(":selected").val()
        field.set("field_type",value)
        @getSelectedView(field)

    getTextFieldView: (field)->
      configView = new EditCreate.TextFieldType model: field
      @getFieldConfig(field).show configView
      field.unset("entry_field_options")

    addOptionCollection: (field)->
      if not field.get("entry_field_options")?
        field_options = new App.Entities.EntryFieldOptions(new App.Entities.EntryFieldOption({text_option: "text"}))
        field.set("entry_field_options",field_options)

    getMultiChoiceFieldView: (field)->
      configView = new EditCreate.MultipleChoiceFieldList model: field, collection: field.get("entry_field_options")
      @getFieldConfig(field).show configView

      @listenTo configView, "add-option:clicked", (view) =>
        view.collection.add(new App.Entities.EntryFieldOption({text_option: "text"}))

      @listenTo configView, "childview:destroy-option:clicked", (view) =>
        if field.get('entry_field_options').size() > 1
          view.model.destroy()
        
    buttonsConfig:(field)->
      options =
        modal: true
        title: if field.isNew() then "Skrá upplýsingar" else "Breyta upplýsingum"
        formClass: "form-horizontal"
      options

    getFieldTypeRegion:(field)->
      @getLayout(field).fieldTypeRegion

    getFieldConfig:(field)->
      @getLayout(field).fieldConfig

    addAsSorted:(model,collection)->
      parent = collection.getParentCollection()
      index = _.sortedIndex(parent.pluck('title'),model.get('title'))
      parent.add(model, {at: index})
      collection.trigger "reset"

    getLayout:(field)->
      @layout ?= new EditCreate.Layout model: field




