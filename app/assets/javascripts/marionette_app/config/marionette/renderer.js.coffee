do (Marionette) ->
  _.extend Marionette.Renderer,
    
    lookups: ["marionette_app/apps/", "marionette_app/components/"]
    
    render: (template, data) ->
      return if template is false
      path = @getTemplate(template)
      throw "Template #{template} not found!" unless path
      path(data)
    
    getTemplate: (template) ->
      for path in [template, template.split("/").insertAt(-1, "templates").join("/")]
        for lookup in @lookups
          return JST[lookup + path] if JST[lookup + path]