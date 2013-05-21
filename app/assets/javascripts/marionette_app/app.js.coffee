@Qapp = do (Backbone, Marionette) ->
  
  App = new Marionette.Application
  
  App.on "initialize:before", (options) ->
    App.environment = options.environment
    @currentUser = App.request "set:current:user", options.currentUser
  
  App.reqres.setHandler "get:current:user", ->
    App.currentUser
  
  App.addRegions
    headerRegion: "#header-region"
    contentRegion: "#content"
    secondaryNavigationRegion: "#secondary-navigation-region"
    dialogRegion: Marionette.Region.Dialog.extend el: "#dialog-region"
  
  App.addInitializer () ->
    App.module("HeaderApp").start()


  App.reqres.setHandler "default:region", ->
    App.contentRegion
  
  App.reqres.setHandler "secondary:navigation:region", ->
    App.secondaryNavigationRegion
  
  App.commands.setHandler "register:instance", (instance, id) ->
    App.register instance, id if App.environment is "development"
  
  App.commands.setHandler "unregister:instance", (instance, id) ->
    App.unregister instance, id if App.environment is "development"

  
  App.on "initialize:after", (options) ->
    if Backbone.history
      Backbone.history.start()
      # rootRoute = if @currentUser.get('role_name') is "respondent" then "d" else "b"
      
      # @navigate(@rootRoute, trigger: true) if @getCurrentRoute() is ""
  
  App

