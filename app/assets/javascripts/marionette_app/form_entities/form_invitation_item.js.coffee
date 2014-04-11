@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.FormInvitationItemModel extends Entities.ResponderItem
    urlRoot: Routes.invitation_items_path()

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
      item = new Entities.FormInvitationItemModel
      item.url = Routes.invitation_item_step_path(options.id, {step_no:options.step_no, type:options.type})
      item.fetch
        reset: true
      item

  App.reqres.setHandler "get:responder:item", (options) ->
    API.getResponderItemForId options

  # _.extend Entities.FormInvitationItemModel::,Entities.FormModel.prototype