@Qapp.module "EntrySetSectionsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  List.vent = new Backbone.Wreqr.EventAggregator()
  List.vent.on("new:section",()-> List.Controller.newSection())
  List.Controller =
    listSections:(options) ->
      @currentEntrySetId = options.entrySetId
      @sectionNo = options.sectionNo
      @getSettingsContentRegion().show @getLayout()
      @getSections()
  
      
    getSections:->
      options=
        sectionNo: @sectionNo
        entrySetId: @currentEntrySetId
        callback: (collection) =>
          @sectionCollection = collection
          @currentSection = _.first(collection.where({display_order: @sectionNo}))
          @showSectionsNavigation(collection)
          App.vent.trigger "show:settings:section:fields", {section: @currentSection}
          @showTitle()

      App.request "entry:set:sections:entities", options

    showSectionsNavigation: (sections) ->
      @getNavigationRegion().show @getNavigationView(sections)
    
    showTitle: ->
      view = new List.Title model: @currentSection
      @getLayout().sectionTitleRegion.show view

    getNavigationRegion: ->
      @getLayout().navigationRegion
    
    
    getContentRegion: ->
      @getLayout().sectionContentRegion


    getSidebarRegion: ->
      @getLayout().entryFieldsSidebarRegion
    
    
    getNavigationView: (collection)->
      new List.SectionsNav 
        collection: collection
        model: @currentSection
        itemViewOptions: 
          entrySetId: @currentEntrySetId
    
    
    getLayout: ()->
      @layout ?= new List.Layout

    
    getSettingsContentRegion: ()->
      App.request("settings:content:region")




