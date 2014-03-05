@Qapp.module "Views", (Views, App, Backbone, Marionette, $, _) ->
	
	class Views.ItemView extends Marionette.ItemView
    serializeData:->
      @.model.attributes

    initialize: ->
      @extendTemplateHelpers(@templateHelpers)

    changeErrors: ->
      
      