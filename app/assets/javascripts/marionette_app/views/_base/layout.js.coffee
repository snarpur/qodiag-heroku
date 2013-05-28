@Qapp.module "Views", (Views, App, Backbone, Marionette, $, _) ->
	
	class Views.Layout extends Marionette.Layout

    # initialize:->
    #   optionHelpers = @options.templateHelpers
    #   unless _.isEmpty(optionHelpers)
    #     helpers = @templateHelpers()
    #     _.each(optionHelpers,((v,k)->
    #       helpers[k] = () -> v
    #       ),@)
    #     @templateHelpers = ()-> helpers
    #   