@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.FormResponderItemModel extends Entities.ResponderItem

    relations: [
      {
        type: Backbone.One
        key: 'subject'
        relatedModel:-> 
          App.Entities.FormPersonModel
      }
      # {
      #   type: Backbone.One
      #   key: 'respondent'
      #   relatedModel:-> 
      #     App.Entities.Entities.FormPersonModel
      # },
    ]

    validation:
      deadline: 
        required: true
        msg: ->
          I18n.t("activerecord.errors.messages.blank")
  

  _.extend Entities.FormResponderItemModel::,Entities.FormModel.prototype