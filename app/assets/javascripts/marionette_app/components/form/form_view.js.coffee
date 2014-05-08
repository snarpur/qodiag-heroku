@Qapp.module "Components.Form", (Form, App, Backbone, Marionette, $, _) ->
	
	class Form.FormWrapper extends App.Views.Layout
		getTemplate: () ->
			if @options.config.modal
				"form/modal-form"
			else
				"form/form"

		tagName: 		"form"
		
		className: ()->
			@options.config.formClass


		attributes: ->
			"data-type": @getFormDataType()
			 

			
		regions:
			formContentRegion: "#form-content-region"
		
		ui:
			buttonContainer: "ul.inline-list"
		
		events:
			"click button[data-form-button]" : "formButtonClick"
			"click button[data-dismiss]" : "closeButtonClick"
			"keyup" : "keypressed"

		formButtonClick:(event)->

			buttonType = $(event.target).attr('data-form-button')
			@trigger("form:#{buttonType}",{sourceButton: buttonType})
			
		keypressed: (e)->
			#We sunmit the form when we press Enter and the focus is not in a textarea
			if e.which is 13 and e.target.type isnt "textarea"
				#We should maybe include the option collection in the form
				@trigger("form:submit",{collection:false})

		closeButtonClick:->
			@trigger("form:cancel")

		modelEvents:
			"change:_errors" 	: "changeErrors"
			"sync:start"			:	"syncStart"
			"sync:stop"				:	"syncStop"
		
		

		initialize:(options)->
			@addOpacityWrapper(false)
			@setInstancePropertiesFor "config", "buttons"
		
		
		setFormContentRegion:(region)->
			@region.formContentRegion = region



		serializeData: ->
			footer: @config.footer
			modal: @config.modal
			title: @config.title or false
			buttons: @buttons?.toJSON() ? false
		
		

		onShow: ->
			_.defer =>
				@focusFirstInput() if @config.focusFirstInput
				@buttonPlacement() if @buttons
			
		

		buttonPlacement: ->
			@ui.buttonContainer.addClass @buttons.placement
		
		

		focusFirstInput: ->
			@$el.find('input[type=text],textarea,select').filter(':visible:enabled:first').focus()
		

		getFormDataType: ->
			if @model.isNew() then "new" else "edit"

		changeErrors: (model, errors, options) ->
			if @config.errors
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
			
		syncStart: (model) ->
			@addOpacityWrapper() if @config.syncing
		
		

		syncStop: (model) ->
			@addOpacityWrapper(false) if @config.syncing


	class Form.FieldView extends App.Views.ItemView

    initialize:(options)->
      @modelIsNew = options.new
      super
    
    getTemplate:()->
      "form/templates/_#{@model.get("fieldType")}_field"

    onRender:->
      if @model.get("_errors")?
        @changeErrors(@model,@model.get("_errors"))

    templateHelpers:=>
      isDisabled:=>
        unless @modelIsNew
          if @model.get("disabled") then "disabled='disabled'" else false

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


  class Form.TextFieldView extends Form.FieldView

  class Form.HiddenFieldView extends Form.FieldView

  class Form.TextAreaFieldView extends Form.FieldView

  class Form.SelectFieldView extends Form.FieldView

    modelEvents:
      "change:options":->
        @render()
        @.stickit()

  class Form.SeparatorFieldView extends Form.FieldView

  class Form.CheckBoxFieldView extends Form.FieldView

  class Form.RadioFieldView extends Form.FieldView

    onShow:->
      @bindings = {}
      @bindings[".#{@model.get("fieldName")}"] = "fieldValue"
      @.stickit()

  class Form.DateFieldView extends Form.FieldView


    ui:=>
      datepick: "##{@model.get("fieldName")}"
       
    onRender:=>
      if @model.get("fieldType") is "date"
        @ui.datepick.datepicker
          dateFormat: "dd/mm/yy"
          minDate: new Date().addDays(1)
          beforeShow:-> 
            $('#ui-datepicker-div').addClass("invitation_calendar");
      super
     
  class Form.FieldCollectionView extends App.Views.CollectionView
    getItemView:(field)-> 
      if field?
        if not field.get('fieldClass')?
          fieldType = "#{_.camelize _.capitalize field.get('fieldType')}FieldView"
          Form[fieldType]
        else
          field.get('fieldClass')
      else 
        Form.TextFieldView

    itemViewOptions: ->
      new: @model.isNew()