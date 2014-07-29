@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  

  class Entities.Relationship extends Entities.Model

  class Entities.Relationships extends Entities.Collection
    model: Entities.Relationship
    url: -> Routes.relationships_path()
