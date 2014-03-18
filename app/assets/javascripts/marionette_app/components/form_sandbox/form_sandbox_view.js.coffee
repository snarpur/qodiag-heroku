@Qapp.module "Components.FormSandbox", (FormSandbox, App, Backbone, Marionette, $, _) ->

  class FormSandbox.FormFieldView extends App.Views.ItemView
    
    getTemplate:()->
      "form_sandbox/templates/_#{@model.get("fieldType")}_field"

    modelEvents:
      "change:_errors": "changeErrors"
    
    changeErrors: (model, errors, options) ->
      @removeErrors()
      @addErrors errors
    
    removeErrors: ->
      @$el.find(".error").removeClass("error")
      @$el.find(".help-inline").text("")

    addErrors: (errors = {}) ->
      for name, array of errors
        @addError name, array
    
    addError: (name, error) ->
      el = @$el.find("[id='#{name}_error']")
      el.closest(".control-group").addClass("error")
      el.text(error)

    onShow:->
      @bindings = {}
      @bindings["##{@model.get("fieldName")}"] = "fieldValue"
      @.stickit()


  class FormSandbox.FormTextFieldView extends FormSandbox.FormFieldView

  class FormSandbox.FormHiddenFieldView extends FormSandbox.FormFieldView

  class FormSandbox.FormTextAreaFieldView extends FormSandbox.FormFieldView

  class FormSandbox.FormSelectFieldView extends FormSandbox.FormFieldView
      
  class FormSandbox.FormSeparatorFieldView extends FormSandbox.FormFieldView

  class FormSandbox.FormRadioFieldView extends FormSandbox.FormFieldView

    onShow:->
      @bindings = {}
      @bindings[".#{@model.get("fieldName")}"] = "fieldValue"
      @.stickit()

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

