 @Qapp.module "EntrySetSectionsApp", (EntrySetSectionsApp, App, Backbone, Marionette, $, _) ->

  class EntrySetSectionsApp.Router extends Marionette.AppRouter
    appRoutes:
      "settings/entry_sets/:entry_set_id/sections(/:section_id)" : "list"


  API =
    list: (entrySetId,sectionId) ->
      options=
        entrySetId: (Number)(entrySetId)
        currentSectionId: (Number)(sectionId) if sectionId
      ctrl = new EntrySetSectionsApp.List.Controller
      ctrl.list(options)
  
    
    createSection:(section)->
      new EntrySetSectionsApp.EditCreate.Controller().create(section)

    editSection:(section)->
      new EntrySetSectionsApp.EditCreate.Controller().edit(section)


  App.commands.setHandler "create:section",(section) ->
    API.createSection(section) 


  App.commands.setHandler "edit:section",(section) ->
    API.editSection(section) 



  
  App.addInitializer ->
    new EntrySetSectionsApp.Router
      controller: API
