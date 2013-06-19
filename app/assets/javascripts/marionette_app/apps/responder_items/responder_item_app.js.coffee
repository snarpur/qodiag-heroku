@Qapp.module "ResponderItemsApp", (ResponderItemsApp, App, Backbone, Marionette, $, _) ->
  
  ResponderItemsApp.rootRoute = "settings#{Routes.entry_sets_path()}"
  
  class ResponderItemsApp.Router extends Marionette.AppRouter
    appRoutes:
      "items" : "listRequests"

  
  API =
    listRequests: () ->
      ResponderItemsApp.List.Controller.items()

    create:(options)->
      ctrl = new ResponderItemsApp.Create.Controller(options)
      ctrl.create()



  App.reqres.setHandler "create:responder:item:view", (options) ->
    API.create(options)


  App.addInitializer ->
    new ResponderItemsApp.Router
      controller: API


