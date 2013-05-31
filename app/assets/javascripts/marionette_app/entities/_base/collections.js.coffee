@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
	
	class Entities.Collection extends Backbone.Collection
    
    toJSON:=>
      if options?.acceptsNested == false
        super
      else
      _.chain(@.models)
        .map(((i)->i.toJSON()),@)
        .compact()
        .value()