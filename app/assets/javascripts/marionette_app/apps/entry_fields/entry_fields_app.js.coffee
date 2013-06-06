@Qapp.module "EntryFieldsApp", (EntryFieldsApp, App, Backbone, Marionette, $, _) ->

  class EntryFieldsApp.Router extends Marionette.AppRouter
    appRoutes:
      "settings/entry_fields" : "list"
  

  API =
    list:->
      ctrl = new EntryFieldsApp.List.Controller()
      ctrl.list()

    create:(options)->
      ctrl = new EntryFieldsApp.Create.Controller(options)
      ctrl.create()
      
    edit:(options)->
      ctrl = new EntryFieldsApp.Create.Controller(options)
      ctrl.edit()

  App.commands.setHandler "create:entry:field",(options) ->
    API.create(options) 


  App.commands.setHandler "edit:entry:field",(options) ->
    API.edit(options) 

  App.addInitializer ->
    new EntryFieldsApp.Router
      controller: API



  

