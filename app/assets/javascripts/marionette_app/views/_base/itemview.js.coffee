@Qapp.module "Views", (Views, App, Backbone, Marionette, $, _) ->
	
	class Views.ItemView extends Marionette.ItemView
    serializeData:->
      @.model.attributes

    initialize:->
      templateOptions = _.omit @options, ['model','collection']
      unless _.isEmpty(templateOptions)
        helpers = @templateHelpers()

        _.each templateOptions, (v,k,l)->
          helpers[k] = _.result(l,k)
          
        @templateHelpers = ()-> helpers
      