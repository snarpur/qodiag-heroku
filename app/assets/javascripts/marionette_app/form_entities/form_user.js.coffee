@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.FormUserModel extends Entities.Person

    validation:
      email: 
        required: true
        msg: ->
          I18n.t("activerecord.errors.messages.blank")

  _.extend Entities.FormUserModel::,Entities.FormModel.prototype