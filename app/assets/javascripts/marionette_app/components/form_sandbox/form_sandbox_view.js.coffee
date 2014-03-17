@Qapp.module "Components.FormSandbox", (FormSandbox, App, Backbone, Marionette, $, _) ->

  class FormSandbox.FormFieldView extends App.Views.ItemView
    getTemplate:()->
      "form_sandbox/templates/_#{@model.get("fieldType")}_field"

    onShow:->
      @bindings = {}
      @bindings["##{@model.get("fieldName")}"] = "fieldValue"
      @.stickit()


  class FormSandbox.FormTextFieldView extends FormSandbox.FormFieldView

  class FormSandbox.FormHiddenFieldView extends FormSandbox.FormFieldView

  class FormSandbox.FormTextAreaFieldView extends FormSandbox.FormFieldView

  class FormSandbox.FormDateFieldView extends FormSandbox.FormFieldView

    ui:=>
      datepick: "##{@model.get("fieldName")}"
       
    onRender:=>
      if @model.get("fieldType") is "date"
        @ui.datepick.datepicker
          dateFormat: "dd/mm/yy"
          minDate: new Date().addDays(1)
          beforeShow:-> 
            $('#ui-datepicker-div').addClass("invitation_calendar");
     
  class FormSandbox.FormFieldCollectionView extends App.Views.CompositeView
    getItemView:(field)-> 
      if field?
        fieldType = "Form#{_.camelize _.capitalize field.get('fieldType')}FieldView"
        FormSandbox[fieldType]
      else 
        FormSandbox.FormTextFieldView

    template: "form_sandbox/templates/wrapper"
    itemViewContainer: '#form-content-region'

