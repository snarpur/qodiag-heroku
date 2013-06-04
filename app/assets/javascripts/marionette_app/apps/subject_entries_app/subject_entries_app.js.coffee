@Qapp.module "SubjectEntriesApp", (SubjectEntriesApp, App, Backbone, Marionette, $, _) ->
  
  class SubjectEntriesApp.Router extends Marionette.AppRouter
    
    appRoutes:
       "people/:person_id/entries" : "list"
       "people/:person_id/entries/:entry_set_response_id(/section/:section_id)" : "list"
  


  API =
    list:(personId,entrySetResponseId,sectionId)->
      App.execute "show:subject:navigation",{personId: personId, currentItemName: 'entries'}
      
      args = _.map _.compact(arguments), (i) -> (Number)(i)
      options = _.object(['personId','entrySetResponseId','sectionId'],args)

      ctrl = new SubjectEntriesApp.List.Controller()
      ctrl.list(options)
    

    create:(options)->
      ctrl = new SubjectEntriesApp.New.Controller(options)
      ctrl.newEntry()
  
    

    show:(options)->
      ctrl = new SubjectEntriesApp.Show.Controller()
      ctrl.show(options)

  



  App.commands.setHandler "new:entry:comment", (options) ->
    API.create options

  

  App.commands.setHandler "show:entry:values", (options) ->
    API.show options
  
  

  App.addInitializer ->
    new SubjectEntriesApp.Router
      controller: API

