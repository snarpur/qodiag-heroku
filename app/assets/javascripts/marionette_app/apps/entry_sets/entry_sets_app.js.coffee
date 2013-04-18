@Qapp.module "EntrySetsApp", (EntrySetsApp, App, Backbone, Marionette, $, _) ->
  @startWithParent = false
  class EntrySetsApp.Router extends Marionette.AppRouter
    appRoutes:
      "entrySets" : "listEntrySets"
  
  API =
    listEntrySets: (options)->
      EntrySetsApp.List.Controller.listEntrySets(options)
  
  EntrySetsApp.on "start", (options)->
    API.listEntrySets(options)

  App.addInitializer ->
    new EntrySetsApp.Router
      controller: API