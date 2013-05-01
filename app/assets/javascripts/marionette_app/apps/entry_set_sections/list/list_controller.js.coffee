@Qapp.module "EntrySetSectionsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  
  List.Controller =
    resetListEvent: "settings:entrySets:sections:reset"
    listSections:(entrySetId,sectionId) ->
      App.EntrySetSectionsApp.vent.on("drop:entryField",=> @addEntryToSection())
      App.EntrySetSectionsApp.vent.on("save:sectionFields",(options)=> @saveSectionFields(options))
      @currentEntrySetId = entrySetId
      @currentSectionId = sectionId
      @getSettingsContentRegion().show @getLayout()
      
      options=
        sectionId: @currentSectionId
        entrySetId: @currentEntrySetId
        callback: (collection) =>
          @showSectionsNavigation(collection)
          @currentSectionId ?= collection.first().id
          @currentSection = collection.get(@currentSectionId)
          # @getSectionEntryFields()
      

      
      App.request "entrySetSections:entities", options
    
    
    showSectionsNavigation: (sections) ->
      @getNavigationRegion().show @getNavigationView(sections)
    
    
    showSection: (view)->
      @getContentRegion().show view

    
    getSectionEntryFields:()->
      @currentSection.getSectionEntryFields((collection) =>
        @entriesCollection = collection
        view = @getContentView(collection)
        @showSection(view)
        @updateSidebarApp()
      )


    getNavigationRegion: ()->
      @getLayout().navigationRegion
    
    
    getContentRegion: ()->
      @getLayout().sectionContentRegion


    getNavigationView: (collection)->
      new List.SectionsNav 
        collection: collection
        itemViewOptions: 
          entrySetId: @currentEntrySetId


    getContentView: (collection)->
      view = new List.Sections
        collection: collection
        model: @currentSection

    
    getLayout: ()->
      @layout ?= new List.Layout

    
    getSettingsContentRegion: ()->
      App.request("settings:content:region")


    updateSidebarApp: () ->
      resetEvent = "settings:entrySets:sections:reset"
      options=
        region: @getLayout().entryFieldsSidebarRegion
        sectionId: @currentSectionId
        entrySetId: @currentEntrySetId
        resetEvent:  @resetListEvent
      
      App.vent.trigger(@resetListEvent,options)
      App.EntryFieldsSidebarApp.start(options)
      @listenToSidebar()
      
    saveSectionFields:(section)->
      callbacks=
        error: ->
          throw "error in entry_sections/list/list_controller.js.coffee:saveSectionFields()"
      section.save(section.toJSON(), callbacks)
     

    addEntryToSection: ->
      @currentSection.addEntryField(@newEntryField)
    
    
    listenToSidebar:->
      App.EntryFieldsSidebarApp.vent.on "settings:entryField:dragged",(entryField) => 
        @newEntryField = entryField



