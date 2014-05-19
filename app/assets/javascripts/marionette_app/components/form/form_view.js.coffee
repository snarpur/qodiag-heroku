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
			# "change:_errors" 	: "changeErrors"
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

    getLabel: (option=null)->
      if @model.get("labelKey")?
        if _.has(@model.get("labelKey"), "i18nBase")
          I18n.t(@model.get("labelKey").i18nBase+"."+option.get("#{@model.get("labelKey").key}"))
        else
          option.get("#{@model.get("labelKey").key}")
      else  
        label = if option?.get("label")? then option.get("label") else @model.get("fieldLabel")
        if _.has(label, "i18n")
          I18n.t(label.i18n)
        else
          label

    templateHelpers:=>
      isDisabled:=>
        unless @modelIsNew
          if @model.get("disabled") then "disabled='disabled'"

      label:=>
        @getLabel()

      value:()=>
        if @model.get("valueKey")?
          @model.get("valueKey")
        else
          "value"
    

    modelEvents:
      "change:_errors": "changeErrors"
      "change:options": "optionsChanged"




    # Override when it is needed  
    optionsChanged:=>
 
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

    optionsChanged:=>
      @render()
      @.stickit()

    templateHelpers:=>
      parent = super
      _.extend(parent,
        selectOptions:=>
          @model.get("options").models

        label:(option)=>
          @getLabel(option)
              
      )


  class Form.SeparatorFieldView extends Form.FieldView

  class Form.CheckBoxFieldView extends Form.FieldView

    events:
      "change input[type='checkbox']":"checkboxChange"

    getOptions:=>
      if @model.get('conditions')?
        @model.get('options').where(@model.get('conditions'))
      else
        @model.get("options").models


    checkboxChange:(event)=>
      key = if @model.get("optionText")? then @model.get("optionText") else "text"
      query = {}
      query[key] = event.currentTarget.value
      modelChecked = @model.get("options").findWhere(query)
      if modelChecked?        
        modelChecked.set("_destroy",!event.currentTarget.checked)
        modelChecked.set("_status",event.currentTarget.checked)


    templateHelpers:=>
      parent = super
      _.extend(parent,
        
        checkBoxOptions:=>
          @getOptions()

        isChecked:(option)=>
          if option.get("_status")? and option.get("_status") then "checked='checked'"

        label:(option)=>
          @getLabel(option)

      )


  class Form.RadioFieldView extends Form.SelectFieldView

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