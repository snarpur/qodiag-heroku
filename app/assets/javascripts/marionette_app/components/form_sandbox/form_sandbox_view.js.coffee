@Qapp.module "Components.FormSandbox", (FormSandbox, App, Backbone, Marionette, $, _) ->

  class FormSandbox.FormFieldView extends App.Views.ItemView
    getTemplate:()->
      switch @model.get("fieldType")
        when "text" then "form_sandbox/templates/_text_field"
        when "textarea" then "form_sandbox/templates/_textarea_field"
        else "form_sandbox/templates/_hidden_field"
    
    onShow:->
      @bindings = {}
      @bindings["##{@model.get("fieldName")}"] = "fieldValue"
      @.stickit()
     
  class FormSandbox.FormFieldCollectionView extends App.Views.CompositeView
    itemView: FormSandbox.FormFieldView
    template: "form_sandbox/templates/wrapper"
    itemViewContainer: '#form-content-region'

