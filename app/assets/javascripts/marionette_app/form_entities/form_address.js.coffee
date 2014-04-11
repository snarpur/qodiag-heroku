@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.FormAddressModel extends Entities.Address
    
  # _.extend Entities.FormAddressModel::,Entities.FormModel.prototype