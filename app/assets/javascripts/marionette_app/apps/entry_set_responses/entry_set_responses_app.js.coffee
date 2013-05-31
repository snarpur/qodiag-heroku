@Qapp.module "EntrySetResponsesApp", (EntrySetResponsesApp, App, Backbone, Marionette, $, _) ->
  
  
  class EntrySetResponsesApp.Router extends Marionette.AppRouter
    appRoutes:
      "entry_set_responses/:entry_set_response_id(/section/:section_id)" : "edit"

  
  API =
    edit: (entrySetResponseId,sectionId) ->
      console.log "REFRESHING", arguments
      options = _.object ['entrySetResponseId','sectionId'], _.map(arguments ,(i)-> (Number)(i) if i)
      new EntrySetResponsesApp.Edit.Controller().edit(options)  
    
  

  App.vent.on "form:step:navigate", (params) ->
    API.edit(params...)
    App.navigate "entry_set_responses/#{params[0]}/#{params[1]}/sections/#{params[2]}"



  App.addInitializer ->
    new EntrySetResponsesApp.Router
      controller: API
