@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.FormPreRegistrationModel extends Entities.ResponderItem
    urlRoot: Routes. pre_registrations_path()

    initialize:->
      @validation = {}
      super

    relations: [
      {
        type: Backbone.One
        key: 'subject'
        relatedModel:-> 
          App.Entities.FormPersonModel
      },
      {
        type: Backbone.One
        key: 'respondent'
        relatedModel:-> 
          App.Entities.FormPersonModel
      }
    ]

  API =

    getResponderItemForId: (options) ->
      item = new Entities.FormPreRegistrationModel
      item.url = Routes.pre_registration_step_path(options.id, {step_no:options.step_no})
      item.fetch
        reset: true
      item

  App.reqres.setHandler "get:responder:item:pre:registration", (options) ->
    API.getResponderItemForId options