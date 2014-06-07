@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
	
	class Entities.Button extends Backbone.Model
		defaults:
			buttonType: "button"
		
	class Entities.ButtonsCollection extends Backbone.Collection
		model: Entities.Button

		comparator:(button)->
			button.get('order')
	
	API =
		getFormButtons: (buttons, model) ->		
			buttons = @getDefaultButtons buttons, model
			buttonCollection = new Entities.ButtonsCollection buttons
			buttonCollection.placement = buttons.placement

			buttonCollection
		
		getDefaultButtons: (buttons, model) ->
			defaultButtons = 
				buttons:
					primary: {text: I18n.t("actions.save"), className: "btn btn-primary", order: 1, buttonType: 'submit'}
					cancel: {text: I18n.t("actions.cancel"), className: "btn btn-default", order: 2, buttonType: "cancel", dataDismiss: "data-dismiss='modal'"} 
				config:
					placement: "right"


			_.chain(_.union(_.keys(buttons),_.keys(defaultButtons.buttons)))
				.map (i) ->
					unless buttons[i] is false
						defaultButtons.buttons[i] ?= {}
						_.extend(defaultButtons.buttons[i],buttons[i])
				.compact()
				.value()


			
			

				
	
	App.reqres.setHandler "form:button:entities", (buttons = {}, model) ->
		API.getFormButtons buttons, model