 @Qapp.module "EntryFieldsSidebarApp", (EntryFieldsSidebarApp, App, Backbone, Marionette, $, _) ->
  # @startWithParent = false
  

  API =
    listEntryFields: ()->
      EntryFieldsSidebarApp.List.Controller.listSections()

  App.vent.on "show:settings:section:fields",(options)=>
    API.listEntryFields()
  

  EntryFieldsSidebarApp.on "start",(options) ->
    @vent = new Backbone.Wreqr.EventAggregator()