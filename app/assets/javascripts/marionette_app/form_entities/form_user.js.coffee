@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.FormUserModel extends Entities.Person

  _.extend Entities.FormUserModel::,Entities.FormModel.prototype