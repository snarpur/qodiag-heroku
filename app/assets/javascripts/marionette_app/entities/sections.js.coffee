@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.Section extends Entities.Model


  
  class Entities.Sections extends Entities.Collection
    model: Entities.Section
    url: -> Routes.sections_path()
  
  API =
    getSection:(options)->
      # console.log "--- getSection() SECTION ENTITY ---"


   
  App.reqres.setHandler "entities:section", (options) ->
    API.getSection options
