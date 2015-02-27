@Qapp.module "Components.Form", (Form, App, Backbone, Marionette, $, _) ->
	
	class Form.Controller extends App.Controllers.Base
		
		initialize: (options = {}) ->
			@contentView = options.view
			@modal = options.config.modal
			@collection = options.config.collection ? false
			@formLayout = @getFormLayout options.config

			@listenTo @formLayout, "show", @formContentRegion
			
			@listenTo @formLayout, "form:submit", (options)=> 
				@formSubmit(options)
			
			@listenTo @formLayout, "form:cancel", @formCancel

			#Save the attributes state when we open the window when whe are using a modal window, just in case we press Cancel Button
			if (@modal)
				bindings = _.values @contentView.bindings
				@previous = @contentView.model.pick(bindings...)
			
		
		formCancel: ->
			if (@modal)
				#Set the attribute previous values
				@contentView.model.set(@previous)
				@contentView.model.unset("_errors") 
				App.dialogRegion.closeDialog()
			else
				@contentView.triggerMethod "form:cancel"		
		

		formSubmit: (options={}) ->
			@contentView.triggerMethod("form:submit")
			model = @contentView.model
			collection = @getCollection(model)
			# collection = options.collection ? @contentView.collection
			
			@listenToOnce model, "validated:invalid validated:valid", (model,msg)=>
				@stopListening model, "validated:invalid validated:valid"
				
				if _.isEmpty model._errorsWithNested()
					@formLayout.trigger "before:form:submit"
					@processFormSubmit model, collection
			
			model.validateNested()
			

		getCollection: (model) ->
			if @collection?
				@collection
			else
				if model instanceof @contentView.collection.model
					@contentView.collection
				else
					false


		processFormSubmit: (model, collection) ->
			model.save model.toJSON(),
				collection: collection
			
			#If the form is inside a modal window we listen to created or updated to take the propers action in the dialog region
			if (@modal)	
				@listenTo model, "created updated", ()=>
					App.dialogRegion.closeDialog()


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
				view: @contentView
				

		getDefaultConfig: (config = {}) ->
			_.defaults config,
				footer: true
				focusFirstInput: true
				errors: true
				syncing: false
				modal: false
				formClass: ""
		

		getButtons: (buttons = {}) ->
			App.request("form:button:entities", buttons, @contentView.model) unless buttons is false
	
	



	App.reqres.setHandler "form:wrapper", (contentView, options = {}) ->
		throw new Error I18n.t("marionette.errors.model_not_found") unless contentView.model
		formController = new Form.Controller
			view: contentView
			config: options
		formController.formLayout
