@Qapp = do (Backbone, Marionette) ->
  
  App = new Marionette.Application
  App.Qodiag = {}
  App.Qodiag.namespace = "Qapp"
  App.on "initialize:before", (options) ->
    App.environment = options.environment
    @currentUser = App.request "set:current:user", options.currentUser
  
  App.reqres.setHandler "get:current:user", ->
    App.currentUser
  
  App.addRegions
    headerRegion: "#header-region"
    contentRegion: "#content"
    contentHeaderRegion: "#content-header"
    dialogRegion: Marionette.Region.Dialog.extend el: "#dialog-region"
  
  
  App.reqres.setHandler "default:region", ->
    App.contentRegion
  
  App.reqres.setHandler "content:header:region", ->
    App.contentHeaderRegion
  
  App.commands.setHandler "register:instance", (instance, id) ->
    App.register instance, id if App.environment is "development"
  
  App.commands.setHandler "unregister:instance", (instance, id) ->
    App.unregister instance, id if App.environment is "development"

  
  Backbone.history.on "route", ()->
    App.showHideSidebar App.getCurrentRoute()

  App.on "initialize:after", (options) ->
    if Backbone.history
      Backbone.history.start()
      if @routeToCaretakerRoot(@currentUser)
        window.location.href = "/users"
        return
      @navigate(@rootUrl(@currentUser), trigger: true) unless @getCurrentRoute()?

  App

