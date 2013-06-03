@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
	
	class Entities.Button extends Entities.Model
		defaults:
			buttonType: "button"
		
	class Entities.ButtonsCollection extends Entities.Collection
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
					primary: {text: "Save", className: "btn btn-primary", order: 1, buttonType: 'submit'}
					cancel: {text: "Cancel", className: "btn", order: 2, buttonType: "cancel"} 
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