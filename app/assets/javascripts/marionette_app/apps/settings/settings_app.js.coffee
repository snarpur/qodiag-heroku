@Qapp.module "SettingsApp", (SettingsApp, App, Backbone, Marionette, $, _) ->
  
  SettingsApp.rootRoute = "settings#{Routes.entry_sets_path()}"
  
  class SettingsApp.Router extends Marionette.AppRouter
    appRoutes:
      "settings" : "listRootSettings"

  
  API =
    listRootSettings: () ->
      ctrl = new SettingsApp.List.Controller
      ctrl.listSettings()
      SettingsApp.app.navigate(SettingsApp.rootRoute, trigger: true)

    showSettingsRegion: (options) ->
      ctrl = new SettingsApp.List.Controller
      ctrl.listSettings(options)



  App.vent.on("show:settings",(options)->
    API.showSettingsRegion(options)
  )
  

  App.addInitializer ->
    new SettingsApp.Router
      controller: API