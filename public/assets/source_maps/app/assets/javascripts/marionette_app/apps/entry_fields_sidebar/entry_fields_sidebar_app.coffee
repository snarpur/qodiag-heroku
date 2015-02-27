 @Qapp.module "EntryFieldsSidebarApp", (EntryFieldsSidebarApp, App, Backbone, Marionette, $, _) ->
 
  API =
    listEntryFields: (options)->
      ctrl = new EntryFieldsSidebarApp.List.Controller
      ctrl.list(options)

  App.commands.setHandler "show:settings:sidebar:fields",(options)=>
    API.listEntryFields(options)
  

