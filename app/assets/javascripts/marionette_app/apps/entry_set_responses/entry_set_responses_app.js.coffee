@Qapp.module "EntrySetResponsesApp", (EntrySetResponsesApp, App, Backbone, Marionette, $, _) ->
  
  
  class EntrySetResponsesApp.Router extends Marionette.AppRouter
    appRoutes:
      "entry_set_responses/:responseId/:entrySetId(/sections/:sectionNo)" : "edit"

  
  API =
    edit: (responseId, entrySetId,sectionNo) ->
      sectionNo ?= 1
      options=
        sectionNo: (Number)(sectionNo)
        responseId: (Number)(responseId)
        entrySetId: (Number)(entrySetId)
      
      new EntrySetResponsesApp.Edit.Controller(options).edit()  
    
  

  App.vent.on "form:step:navigate", (params) ->
    API.edit(params...)
    App.navigate "entry_set_responses/#{params[0]}/#{params[1]}/sections/#{params[2]}"



  App.addInitializer ->
    new EntrySetResponsesApp.Router
      controller: API
