@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  

  class Entities.ResponderItem extends Entities.Model
    nestedAttributeList: ['entry_set_response']
    urlRoot: Routes.responder_items_path()
    paramRoot: 'responder_item'
    
    relations: [
      {
        type: Backbone.One
        key: 'entry_set_response'
        relatedModel:-> 
          App.Entities.EntrySetResponse
      },
      {
        type: Backbone.One
        key: 'subject'
        relatedModel:-> 
          App.Entities.Person
      },
      {
        type: Backbone.One
        key: 'respondent'
        relatedModel:-> 
          App.Entities.Person
      }
    ]

    
    # initialize: (models,options) ->
    #   super
      #@initAttributes()

    #REFACTOR: change entry_set_response to relation (BackboneAcossiation) and delete initAttributes()
    initAttributes:(model,value)->
      if _.isEmpty(arguments)
        eventStr = _.map(@nestedAttributeList,(i)-> "change:#{i}").join(" ")
        @on(eventStr, @initAttributes)
        _.each(@nestedAttributeList,((i)-> @_createNestedEntity(i,@get(i))),@)
      else
        changed = _.invert(@changed)[value]
        @_createNestedEntity(changed,@get(changed)) if _.contains @nestedAttributeList, changed


  class Entities.ResponderItems extends Entities.Collection
    model: Entities.ResponderItem
    
    initialize: (models,options) ->
      @personId = options.personId
      @url= ()->
        Routes.person_responder_items_path(@personId)  




  


  API =
    getResponderItemsForPerson: (options) ->
      items = new Entities.ResponderItems([],options)
      items.fetch
        reset: true
      items

    getEntrySetResponderItemsForPerson:(options)->
      item = new Entities.ResponderItems([],options)
      item.url = Routes.person_entry_set_items_path(options.personId)
      item.fetch
        reset: true
      item

  App.reqres.setHandler "get:person:responder:items", (options) ->
    API.getResponderItemsForPerson options


  App.reqres.setHandler "get:person:entry:set:responder:items", (options) ->
    API.getEntrySetResponderItemsForPerson options


  
