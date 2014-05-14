@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.FormResponderItemModel extends Entities.ResponderItem

    initialize:->
      @validation = {}
      super

    relations: [
      {
        type: Backbone.One
        key: 'entry_set_response'
        relatedModel:-> 
          App.Entities.EntrySetResponse
      },
      {
        type: Backbone.One
        key: 'respondent'
        relatedModel:->
          App.Entities.Person
      }
    ]

