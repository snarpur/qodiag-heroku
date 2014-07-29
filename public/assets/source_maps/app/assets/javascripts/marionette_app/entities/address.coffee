@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  

  class Entities.Address extends Entities.Model

  class Entities.Addresses extends Entities.Collection
    model: Entities.Address
