@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
	
	class Entities.Collection extends Backbone.Collection
    
    toJSON:=>
      _.chain(@.models)
        .map(((i)->i.toJSON()),@)
        .compact()
        .value()