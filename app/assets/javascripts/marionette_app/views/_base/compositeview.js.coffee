@Qapp.module "Views", (Views, App, Backbone, Marionette, $, _) ->
	
	class Views.CompositeView extends Marionette.CompositeView
    itemViewEventPrefix: "childview"
    
    serializeData:->
      _.map @.collection.models, (i)->
        i.attributes
  

    #REFACTOR: make index a function to avoid JSON serialization
    itemViewOptions: (model,index) =>
      options = 
        index: index
      if @childViewOptions?
        _.extend options, @childViewOptions()
      else
        options 

    initialize: ->
      @extendTemplateHelpers(@templateHelpers)
