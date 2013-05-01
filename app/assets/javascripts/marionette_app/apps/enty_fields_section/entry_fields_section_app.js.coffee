@Qapp.module "EntryFieldsSectionApp", (EntryFieldsSectionApp, App, Backbone, Marionette, $, _) ->
  @startWithParent = false

  
  API =
    showFields: (options)->
      EntryFieldsSectionApp.Show.Controller.showFields(options)

  
  EntryFieldsSectionApp.on "start", (options)->
    API.showFields(options)

  App.reqres.addHandler "start:entryFieldsSectionApp", (options)->
    EntryFieldsSectionApp.start(options)
  # App.addInitializer ->
  #   new EntryFieldsSectionApp.Router
  #     controller: API