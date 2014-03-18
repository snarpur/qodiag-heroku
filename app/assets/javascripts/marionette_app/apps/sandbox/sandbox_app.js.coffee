@Qapp.module "SandboxApp", (SandboxApp, App, Backbone, Marionette, $, _) ->

  class SandboxApp.Router extends Marionette.AppRouter
    appRoutes:
      "sandbox" : "create"

  API =
    create:->
      ctrl = new SandboxApp.EditCreate.Controller
      ctrl.create()

  App.addInitializer ->
    new SandboxApp.Router
      controller: API
