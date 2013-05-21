@Qapp.module "EntrySetsApp", (EntrySetsApp, App, Backbone, Marionette, $, _) ->
  
  class EntrySetsApp.Router extends Marionette.AppRouter
    appRoutes:
       "settings/entry_sets" : "listEntrySets"
  
  API =
    listEntrySets: (options)->
      App.vent.trigger("show:settings")
      list = new EntrySetsApp.List.Controller
      list.listEntrySets(options)

  
  # EntrySetsApp.on "before:start", (options)->
  #   App.vent.trigger("show:settings")


  App.addInitializer ->
    new EntrySetsApp.Router
      controller: API