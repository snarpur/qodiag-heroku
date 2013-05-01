@Qapp.module "Views", (Views, App, Backbone, Marionette, $, _) ->
	
	class Views.CompositeView extends Marionette.CompositeView
    serializeData:->
      _.map @.collection.models, (i)->
        i.attributes