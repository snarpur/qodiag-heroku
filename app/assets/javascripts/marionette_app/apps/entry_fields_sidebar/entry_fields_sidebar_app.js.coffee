 @Qapp.module "EntryFieldsSidebarApp", (EntryFieldsSidebarApp, App, Backbone, Marionette, $, _) ->
  @startWithParent = false
  

  API =
    listEntryFields: (options)->
      EntryFieldsSidebarApp.List.Controller.listSections(options)

  EntryFieldsSidebarApp.on "start",(options) ->
    @vent = new Backbone.Wreqr.EventAggregator()
    App.vent.on options.resetEvent, (options)=> 
     API.listEntryFields(options)
    
    API.listEntryFields(options)