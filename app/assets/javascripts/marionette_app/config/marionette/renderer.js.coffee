Backbone.Marionette.Renderer.render = (template, data) ->
	path = JST["marionette_app/apps/" + template]
	unless path
		throw "Template #{template} not found!"
	path(data)