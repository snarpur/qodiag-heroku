@Qapp.module "EntrySetSectionsApp.List", (List, App, Backbone, Marionette, $, _) ->
  

  class List.Controller extends App.Controllers.Base
    
    initialize:->
      App.contentRegion.show @getLayout()

    
    
    list:(options) ->
      @getContentRegion().once "show", (region)=> 

        @executeSidebar 
          droppableCollection: region.model.collection
          droppableElement: region.$itemViewContainer
      
      @getEntrySet(options.entrySetId)
      @getSections(options)
    


    getEntrySet:(id)->
      entrySet = App.request "entry:set:entity", {id: id}
      
      App.execute "when:fetched", entrySet, =>
        @showEntrySetTitle(entrySet)
        @executeSettingsNavigation(entrySet)



    getSections:(options)->
      sections = App.request "entry:set:sections:entities", options
      
      App.execute "when:fetched", sections, =>
        @showSectionsNavigation(sections)
        
        unless sections.length is 0
          @executeFields(model: sections.getCurrentSection())
        
    

    executeFields:(options)->
      App.execute "show:settings:section:fields", 
        _.extend options, region: @getContentRegion()

      @showTitle(options.model)
        


    executeSidebar:(options) ->
      App.execute "show:settings:sidebar:fields",
        _.extend options, region: @getSidebarRegion()
        


    showSectionsNavigation: (sections) ->
      view = @getNavigationView(sections)
      @getNavigationRegion().show view
      
      @listenTo sections ,"change:current:section", (options)=>
        @executeFields options
        App.navigate @sectionUrl(options.model),{replace:true}

      @listenTo view, "add:new:section:clicked", (view)=>
        App.execute "create:section", 
          model: view.collection.newSection()
          collection: view.collection
          activeView: @getLayout()


    
    showTitle:(section) ->
      view = new List.Title model: section
      @getLayout().sectionTitleRegion.show view

      @listenTo view, "edit:title",(options) =>
        
        App.execute "edit:section", 
          model: options.model
          activeView: @getLayout()

    
    
    showEntrySetTitle:(entrySet)->
      view = new List.Title model: entrySet
      @getLayout().entrySetTitleRegion.show view
      
      @listenTo view, "edit:title",(options) =>  
        App.execute "edit:section", 
          model: entrySet
          activeView: @getLayout()
   
    
    executeSettingsNavigation:(entrySet) ->
      App.execute "show:settings:navigation", 
        currentSetting: 'entry_sets' 
        subView: entrySet.get('name')
        region: @getLayout().settingsNavigationRegion


    getNavigationView: (collection)->
      new List.SectionsNav 
        collection: collection
        model: collection.getCurrentSection()

    
    getNavigationRegion: ->
      @getLayout().navigationRegion
    
    
    
    getContentRegion: ->
      @getLayout().sectionContentRegion


    
    getSidebarRegion: ->
      @getLayout().entryFieldsSidebarRegion    
    
    

    getLayout: ()->
      @layout ?= new List.Layout

  
    
    sectionUrl:(section)->
      params = _.values(section.pick("entry_set_id","id"))
      "settings#{Routes.entry_set_section_path(params...)}"



