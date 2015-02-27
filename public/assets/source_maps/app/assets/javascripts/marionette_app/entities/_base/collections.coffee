do (Backbone) ->
  _.extend Backbone.Collection::,Qapp.CollectionMixins.NestedValidation
  

@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
	
	class Entities.Collection extends Backbone.Collection
  

    toJSON:(options)=>
      if options?.acceptsNested == false
        super
      else
      _.chain(@.models)
        .map(((i)->i.toJSON(options)),@)
        .compact()
        .value()
