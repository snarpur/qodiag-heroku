@Qapp.module "Components.Form", (Form, App, Backbone, Marionette, $, _) ->
	
	class Form.Controller extends App.Controllers.Base
		
		initialize: (options = {}) ->
			@contentView = options.view
			
			@formLayout = @getFormLayout options.config
			@listenTo @formLayout, "show", @formContentRegion
			@listenTo @formLayout, "form:submit", @formSubmit
			@listenTo @formLayout, "form:cancel", @formCancel

		
		formCancel: ->
			@contentView.triggerMethod "form:cancel"
		
		formSubmit: (options) ->
			@contentView.triggerMethod("form:submit")
			model = @contentView.model
			collection = @contentView.collection
			model.isValid()
			@formLayout.addErrors(model.validationError)
			@processFormSubmit model, collection
		
		processFormSubmit: (model, collection) ->
			model.save model.toJSON(),
				collection: collection
		
		onClose: ->
			
		
		formContentRegion: ->
			@region = @formLayout.formContentRegion
			@show @contentView
		
		getFormLayout: (options = {}) ->
			config = @getDefaultConfig _.result(@contentView, "form")
			_.extend config, options
			
			buttons = @getButtons config.buttons
			new Form.FormWrapper
				config: config
				model: @contentView.model
				buttons: buttons
		
		getDefaultConfig: (config = {}) ->
			_.defaults config,
				footer: true
				focusFirstInput: true
				errors: true
				syncing: true
		
		getButtons: (buttons = {}) ->
			App.request("form:button:entities", buttons, @contentView.model) unless buttons is false
	
	App.reqres.setHandler "form:wrapper", (contentView, options = {}) ->
		throw new Error "No model found inside of form's contentView" unless contentView.model
		formController = new Form.Controller
			view: contentView
			config: options
		formController.formLayout