 @Qapp.module "EntrySetSectionsApp", (EntrySetSectionsApp, App, Backbone, Marionette, $, _) ->
  # @startWithParent = false
  class EntrySetSectionsApp.Router extends Marionette.AppRouter
    appRoutes:
      "settings/entry_sets/:entry_set_id/sections(/:id)" : "listSections"


  API =
    listSections: (entrySetId,sectionNo) ->
      sectionNo ?= 1
      options=
        entrySetId: (Number)(entrySetId)
        sectionNo: (Number)(sectionNo)
      ctrl = new EntrySetSectionsApp.List.Controller
      ctrl.listSections(options)
  
    newSection:(sections)->
      EntrySetSectionsApp.Create.Controller.new(sections)

  EntrySetSectionsApp.on "start", (options)->
    @vent = new Backbone.Wreqr.EventAggregator()

    @vent.on "new:section",(sections) ->
      API.newSection(sections) 

  
  # App.reqres.setHandler("settings:sections:content:region", => EntrySetSectionsApp.List.Controller.getContentRegion())
  # App.reqres.setHandler("settings:sections:sidebar:region", => EntrySetSectionsApp.List.Controller.getSidebarRegion())
  
  App.addInitializer ->
    new EntrySetSectionsApp.Router
      controller: API