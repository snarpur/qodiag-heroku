@Qapp.module "EntrySetsApp", (EntrySetsApp, App, Backbone, Marionette, $, _) ->
  
  class EntrySetsApp.Router extends Marionette.AppRouter
    appRoutes:
       "settings/entry_sets" : "listEntrySets"
  
  

  API =
    listEntrySets: (options)->
      list = new EntrySetsApp.List.Controller
      list.listEntrySets(options)
      

    create:(options)->
      ctrl = new EntrySetsApp.EditCreate.Controller(options)
      ctrl.create()
      
  App.commands.setHandler "create:entry:set",(options) ->
    API.create(options) 
  
  App.addInitializer ->
    new EntrySetsApp.Router
      controller: API