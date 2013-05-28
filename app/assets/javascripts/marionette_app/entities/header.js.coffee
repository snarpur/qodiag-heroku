@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
	
	class Entities.Header extends Entities.Model
	
	class Entities.HeaderCollection extends Entities.Collection
		model: Entities.Header
	
	API =
		getHeaders: ->

			new Entities.HeaderCollection [
				{ name: I18n.t("navigation.settings"), url: "settings" }
				{ name: I18n.t("devise.sessions.sign_out"), url: Routes.destroy_user_session_path(), options:{ external: true}}
			]
	
	App.reqres.setHandler "header:entities", ->
		API.getHeaders()