@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.EntrySet extends Entities.Model
    urlRoot: Routes.entry_sets_path()
    paramRoot: 'entry_set'

    # backboneAssociations: [
    #   {
    #     type: Backbone.Many
    #     key: 'sections'
    #     relatedModel: App.Entities.Section
    #   }

    # ]


  class Entities.EntrySetsCollection extends Entities.Collection
    model: Entities.EntrySet
    initialize:->
      @url= ()-> Routes.entry_sets_path()
  
  API =
    getEntrySets: (callBack) ->
      entrySets = new Entities.EntrySetsCollection([])
      entrySets.fetch reset: true
      entrySets

    getEntrySet: (options) ->
      entrySet = new Entities.EntrySet(id: options.id)
      entrySet.fetch()
      entrySet

    createEntrySet:(options)->
      entrySet = new Entities.EntrySet name: 'Untitled'
      entrySet.save entrySet.attributes 
      entrySet

    newEntrySet:(options)->
      new Entities.EntrySet options

  
  App.reqres.setHandler "entry:sets:entities", (options = {}) ->
    API.getEntrySets options


  App.reqres.setHandler "entry:set:entity", (options = {}) ->
    API.getEntrySet options


  App.reqres.setHandler "create:entry:set:entity",(options = {}) ->
    API.createEntrySet(options)


  App.reqres.setHandler "new:entry:set:entity",(options = {}) ->
    API.newEntrySet(options)
  