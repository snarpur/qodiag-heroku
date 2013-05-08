@Qapp.module "EntryFieldsSectionApp", (EntryFieldsSectionApp, App, Backbone, Marionette, $, _) ->

  
  API =
    listFields: (options)->
      EntryFieldsSectionApp.List.Controller.listFields(options)
      

  @vent = new Backbone.Wreqr.EventAggregator()

  
  # App.reqres.addHandler("settings:section:sortable:list", => EntryFieldsSectionApp.List.Controller.getSortable())

  App.vent.on "show:settings:section:fields",(options)=>
    API.listFields(options)
