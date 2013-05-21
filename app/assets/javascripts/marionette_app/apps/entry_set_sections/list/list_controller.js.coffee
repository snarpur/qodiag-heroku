@Qapp.module "EntrySetSectionsApp.List", (List, App, Backbone, Marionette, $, _) ->
  

  class List.Controller extends App.Controllers.Base
    
    initialize:()->
      App.vent.trigger("show:settings")
      App.reqres.setHandler("settings:sections:content:region", => @getContentRegion())
      App.reqres.setHandler("settings:sections:sidebar:region", => @getSidebarRegion())
   
    
    listSections:(options) ->
      @currentEntrySetId = options.entrySetId
      @sectionNo = options.sectionNo

      @getSettingsContentRegion().show @getLayout()
      @getSections()
  
      
    getSections:->
      options=
        sectionNo: @sectionNo
        entrySetId: @currentEntrySetId
      @sectionCollection = App.request "entry:set:sections:entities", options
      App.execute "when:fetched", @sectionCollection, =>
        @currentSection = _.first(@sectionCollection.where({display_order: @sectionNo}))
        @showSectionsNavigation(@sectionCollection)
        App.vent.trigger "show:settings:section:fields", {section: @currentSection}
        @showTitle()


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




