@Qapp.module "EntrySetsApp", (EntrySetsApp, App, Backbone, Marionette, $, _) ->
  
  class EntrySetsApp.Router extends Marionette.AppRouter
    appRoutes:
       "settings/entry_sets" : "listEntrySets"
  
  

  API =
    listEntrySets: (options)->
      list = new EntrySetsApp.List.Controller
      list.listEntrySets(options)

    delete:(options)->
      list = new EntrySetsApp.List.Controller(options)
      list.deleteFromEntrySetSections(options)      

    create:(options)->
      ctrl = new EntrySetsApp.EditCreate.Controller(options)
      ctrl.create()

    edit:(options)->
      ctrl = new EntrySetsApp.EditCreate.Controller(options)
      ctrl.edit()

    
      
  App.commands.setHandler "create:entry:set",(options) ->
    API.create(options)

  App.commands.setHandler "edit:entry:set",(options) ->
    API.edit(options) 

  App.commands.setHandler "remove:entry_set",(options) ->
    API.delete(options)

  App.addInitializer ->
    new EntrySetsApp.Router
      controller: API
