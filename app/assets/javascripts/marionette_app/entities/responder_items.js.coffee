@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.ResponderItem extends Entities.Model

  class Entities.ResponderItems extends Entities.Collection
  
    initialize: (models,options) ->
      @personId = options.personId
      @url= ()->
        Routes.person_responder_items_path(@personId)  

  API =
    getResponderItemsForPerson: (options) ->
      items = new Entities.ResponderItems([],options)
      items.fetch
        reset: true

    getResponderItemsForPerson:(options)->
      item = new Entities.ResponderItems([],options)
      item.url = Routes.person_entry_set_items_path(options.personId)
      item.fetch
        reset: true
      item

  App.reqres.setHandler "get:person:responder:items", (options) ->
    API.getResponderItemsForPerson options


  App.reqres.setHandler "get:person:entry:set:responder:items", (options) ->
    API.getResponderItemsForPerson options

  
