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

  _.extend Entities.FormPersonModel::,Entities.FormModel.prototype