@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.FormUserModel extends Entities.User

    initialize:->
      @validation = {}
      super

  _.extend Entities.FormUserModel::,Entities.FormModel.prototype