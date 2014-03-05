@Qapp.module "Components.Form", (Form, App, Backbone, Marionette, $, _) ->
	
	class Form.Controller extends App.Controllers.Base
		
		initialize: (options = {}) ->
			@contentView = options.view
			@modal = options.config.modal
			@formLayout = @getFormLayout options.config
			@listenTo @formLayout, "show", @formContentRegion
			@listenTo @formLayout, "form:submit", @formSubmit
			@listenTo @formLayout, "form:cancel", @formCancel

			#NOTE: Save the attributes state when we open the window when whe are using a modal window, just in case we press Cancel Button
			if (@modal)
				bindings = _.values @contentView.bindings
				@previous = @contentView.model.pick(bindings...)
			
		formCancel: ->
			if (@modal)
				#NOTE: Set the attribute previous values
				@contentView.model.set(@previous)
				@contentView.model.unset("_errors") 
				App.dialogRegion.closeDialog()
			else
				@contentView.triggerMethod "form:cancel"
		
		

		formSubmit: (options) ->
			@contentView.triggerMethod("form:submit")
			model = @contentView.model
			model.once "change:_nested_errors",() =>
				console.log "_nested_errors::",model.get("_nested_errors")
				if not model.get("_nested_errors")?
					@processFormSubmit model, collection
			
			model.validate()



			collection = @contentView.collection
			# errors = {}
			# @extractErrors(model,errors)
			# _.delay(console.log(model.get("_nested_errors")), 5000)
			# setTimeout((-> 
			# 	console.log "_nested_errors",model.get("_nested_errors")),
			# 	5000
			# 	)
			

		extractErrors:(model,errors)->
			if model?
				if model.models?
					_.each model.models, (val) =>
						@extractErrors(val,errors)
				else
					errors = _.extend errors, model.get("_errors")
				if model.relations?
					nested = _.pluck model.relations, "key"
					_.each nested, (val) =>
						if model.get(val)?
							@extractErrors(model.get(val),errors)     		

		processFormSubmit: (model, collection) ->
			
			model.save model.toJSON(),
				collection: collection
			
			# NOTE: If the form is inside a modal window we listen to created or updated to take the propers action in the dialog region
			if (@modal)	
				@listenTo model, "created updated", ()=>
					App.dialogRegion.closeDialog()

		
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