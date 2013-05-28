Backbone.Marionette.Renderer.render = (template, data) ->
  unless  _.startsWith(template,"templates")
    template = "templates/#{template}" 
  throw "Template '" + template + "' not found!"  unless JST["backbone_app/#{template}"]
  JST["backbone_app/#{template}"] data
