Backbone.Marionette.Renderer.render = (template, data) ->
  unless  _.startsWith(template,"templates")
    template = "templates/#{template}" 
  throw "Template '" + template + "' not found!"  unless JST[template]
  JST[template] data
