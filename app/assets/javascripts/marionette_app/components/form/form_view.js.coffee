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
			#NOTE: We sunmit the form when we press Enter and the focus is not in a textarea
			if e.which is 13 and e.target.type isnt "textarea"
				@trigger("form:submit")

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
			@$el.find('input[type=text],textarea,select').filter(':visible:first').focus()
		

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