Backbone.Marionette.Renderer.render = (template, data) ->
  unless  _.startsWith(template,"templates")
    template = "templates/#{template}" 
  throw I18n.t("marionette.errors.template_not_found", template: template) unless JST["backbone_app/#{template}"]
  JST["backbone_app/#{template}"] data
