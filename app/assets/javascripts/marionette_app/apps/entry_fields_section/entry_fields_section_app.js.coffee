@Qapp.module "EntryFieldsSectionApp", (EntryFieldsSectionApp, App, Backbone, Marionette, $, _) ->

  
  API =
    listFields: (options)->
      ctrl = new EntryFieldsSectionApp.List.Controller
      ctrl.list(options)

  
  App.commands.setHandler "show:settings:section:fields",(options)=>
    API.listFields(options)
