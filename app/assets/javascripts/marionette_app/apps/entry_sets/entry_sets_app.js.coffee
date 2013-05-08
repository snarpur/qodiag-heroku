@Qapp.module "EntrySetsApp", (EntrySetsApp, App, Backbone, Marionette, $, _) ->
  # @startWithParent = false
  class EntrySetsApp.Router extends Marionette.AppRouter
    appRoutes:
       "settings/entry_sets" : "listEntrySets"
  
  API =
    listEntrySets: (options)->
      EntrySetsApp.List.Controller.listEntrySets(options)

  
  EntrySetsApp.on "before:start", (options)->
    App.vent.trigger("show:settings")


  App.addInitializer ->
    new EntrySetsApp.Router
      controller: API