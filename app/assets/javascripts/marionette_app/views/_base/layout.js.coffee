@Qapp.module "Views", (Views, App, Backbone, Marionette, $, _) ->
	
	class Views.Layout extends Marionette.Layout
    serializeData:->
      @model.attributes if @model
    
    initialize: ->
      super
      @extendTemplateHelpers(@templateHelpers)


