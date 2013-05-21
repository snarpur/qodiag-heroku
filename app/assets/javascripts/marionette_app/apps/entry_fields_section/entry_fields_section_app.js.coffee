@Qapp.module "EntryFieldsSectionApp", (EntryFieldsSectionApp, App, Backbone, Marionette, $, _) ->

  
  API =
    listFields: (options)->
      ctrl = new EntryFieldsSectionApp.List.Controller
      ctrl.listFields(options)

  
  # App.reqres.setHandler("settings:section:sortable:list", => EntryFieldsSectionApp.List.Controller.getSortable())

  App.vent.on "show:settings:section:fields",(options)=>
    API.listFields(options)
