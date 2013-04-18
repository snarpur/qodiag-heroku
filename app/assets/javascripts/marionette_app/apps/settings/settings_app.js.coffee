@Qapp.module "SettingsApp", (SettingsApp, App, Backbone, Marionette, $, _) ->
  
  class SettingsApp.Router extends Marionette.AppRouter
    appRoutes:
      "settings(/:setting)" : "listSettings"

  
  API =
    listSettings: (setting)->
      SettingsApp.List.Controller.listSettings(_.camelize("_#{setting}"))
  

  App.addInitializer ->
    new SettingsApp.Router
      controller: API