@Qapp.module "Components.FormSandbox", (FormSandbox, App, Backbone, Marionette, $, _) ->

  class FormSandbox.FormFieldView extends App.Views.ItemView
    getTemplate:()->
      switch @model.get("fieldType")
        when "text" then "form_sandbox/templates/_text_field"
        when "textarea" then "form_sandbox/templates/_textarea_field"
        when "date" then "form_sandbox/templates/_date_field"
        else "form_sandbox/templates/_hidden_field"
    
    onShow:->
      @bindings = {}
      @bindings["##{@model.get("fieldName")}"] = "fieldValue"
      @.stickit()

    initialize:->
      if @model.get("fieldType") is "date"
        @ui =
          datepick: "#deadline"

      super    

    onRender:=>
      if @model.get("fieldType") is "date"
        _this = @
        @ui.datepick.datepicker
          dateFormat: "dd/mm/yy"
          minDate: new Date().addDays(1)
          beforeShow:-> 
            $('#ui-datepicker-div').addClass("invitation_calendar");
     
  class FormSandbox.FormFieldCollectionView extends App.Views.CompositeView
    itemView: FormSandbox.FormFieldView
    template: "form_sandbox/templates/wrapper"
    itemViewContainer: '#form-content-region'

