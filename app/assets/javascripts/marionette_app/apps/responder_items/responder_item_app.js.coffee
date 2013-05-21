@Qapp.module "ResponderItemsApp", (ResponderItemsApp, App, Backbone, Marionette, $, _) ->
  
  ResponderItemsApp.rootRoute = "settings#{Routes.entry_sets_path()}"
  
  class ResponderItemsApp.Router extends Marionette.AppRouter
    appRoutes:
      "items" : "listRequests"

  
  API =
    listRequests: () ->
      ResponderItemsApp.List.Controller.items()


  App.addInitializer ->
    new ResponderItemsApp.Router
      controller: API
