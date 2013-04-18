@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.EntrySet extends Entities.Model
  
  class Entities.EntrySetsCollection extends Entities.Collection
    model: Entities.EntrySet
    url: -> Routes.entry_sets_path()
  
  API =
    getEntrySetsEntities: (callBack) ->
      entrySets = new Entities.EntrySetsCollection
      entrySets.fetch
        success: ->
          callBack entrySets

  
  App.reqres.addHandler "entrySets:entities", (callBack) ->
    API.getEntrySetsEntities callBack