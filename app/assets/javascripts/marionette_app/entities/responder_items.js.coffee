@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  

  class Entities.ResponderItem extends Entities.Model
    nestedAttributeList: ['entry_set_response']
    urlRoot: Routes.responder_items_path()
    paramRoot: 'responder_item'

    # validation:
    #   respondent_id:
    #     required: true
    #     msg: ->
    #       I18n.t("activerecord.errors.messages.blank")
    #   subject_id:
    #     required: true
    #     msg: ->
    #       I18n.t("activerecord.errors.messages.blank")
    #   deadline:
    #     required: true
    #     msg: ->
    #       I18n.t("activerecord.errors.messages.blank")
    #   entry_set_response:
    #     required: true
    #     msg: ->
    #       I18n.t("activerecord.errors.messages.blank")

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



  class Entities.ResponderItems extends Entities.Collection
    model: Entities.ResponderItem
    
    initialize: (models,options) ->
      @personId = options.personId
      @url= ()->
        Routes.person_responder_items_path(@personId)

      super 

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

