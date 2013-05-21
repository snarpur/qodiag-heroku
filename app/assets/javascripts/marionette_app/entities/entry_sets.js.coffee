@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.EntrySet extends Entities.Model
  
  class Entities.EntrySetsCollection extends Entities.Collection
    model: Entities.EntrySet
    url: -> Routes.entry_sets_path()
  
  API =
    getEntrySetsEntities: (callBack) ->
      entrySets = new Entities.EntrySetsCollection
      entrySets.fetch
        reset: true
      entrySets

  
  App.reqres.setHandler "entry:sets:entities", (callBack) ->
    API.getEntrySetsEntities callBack

  