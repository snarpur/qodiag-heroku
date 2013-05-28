@Qapp.module "Views", (Views, App, Backbone, Marionette, $, _) ->
	
	class Views.ItemView extends Marionette.ItemView
    serializeData:->
      @.model.attributes

    # initialize:->
    #   templateOptions = @options.templateOptions
    #   unless _.isEmpty(itemViewOptions)
    #     helpers = @templateHelpers()

    #     _.each(itemViewOptions,((v,k)->
    #       helpers[k] = () -> v
    #       ),@)
    #     @templateHelpers = ()-> helpers
    #   