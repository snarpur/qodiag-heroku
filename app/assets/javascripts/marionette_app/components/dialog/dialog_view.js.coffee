@Qapp.module "Components.Dialog", (Dialog, App, Backbone, Marionette, $, _) ->
	
	class Dialog.DialogWrapper extends App.Views.Layout
		template: "dialog/dialog"
		className: 'modal'
		
		regions:
			dialogContentRegion: "#dialog-content-region"
	