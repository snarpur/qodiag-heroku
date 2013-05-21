 @Qapp.module "EntryFieldsSidebarApp", (EntryFieldsSidebarApp, App, Backbone, Marionette, $, _) ->
  # @startWithParent = false
  

  API =
    listEntryFields: ()->
      ctrl = new EntryFieldsSidebarApp.List.Controller
      ctrl.listSections()

  App.vent.on "show:settings:section:fields",(options)=>
    API.listEntryFields()
  

