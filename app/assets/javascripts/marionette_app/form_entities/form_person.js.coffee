@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.FormPersonModel extends Entities.Person

    relations: [
      {
        type: Backbone.One
        key: 'user'
        relatedModel:-> 
          App.Entities.FormUserModel
      },
      {
        type: Backbone.One
        key: 'address'
        relatedModel:-> 
          App.Entities.FormAddressModel
      }
    ]

    validation:
      firstname: 
        required: true
        msg: ->
          I18n.t("activerecord.errors.messages.blank")
      lastname: 
        required: true
        msg: -> 
          I18n.t("activerecord.errors.messages.blank")
      full_cpr: 
        required: true
        msg: ->
          I18n.t("activerecord.errors.messages.blank")
      

  _.extend Entities.FormPersonModel::,Entities.FormModel.prototype