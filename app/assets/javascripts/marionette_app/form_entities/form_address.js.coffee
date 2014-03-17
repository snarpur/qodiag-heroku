@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.FormAddressModel extends Entities.Person

  _.extend Entities.FormAddressModel::,Entities.FormModel.prototype