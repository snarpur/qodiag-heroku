@Qapp.module "EntrySetSectionsApp.List", (List, App, Backbone, Marionette, $, _) ->
  

  class List.Controller extends App.Controllers.Base
    
        
    list:(options) ->
      @getEntrySet(options)

 
    
    
    showSidebarOnce:->
      
      @getEntryFieldsRegion().on "show", (region)=> 
        @executeSidebar 
          droppableCollection: region.model.collection
          droppableElement: region.$itemViewContainer

    
    
    getEntrySet:(options)->
      entrySet = App.request "entry:set:entity", {id: options.entrySetId}

      App.execute "when:fetched", entrySet, =>           
        App.contentRegion.show @getLayout(entrySet)
        window.sectionregion = @getSectionContentRegion()
        
        @showSidebarOnce()

        @showEntrySetTitle(entrySet)
        @executeSettingsNavigation(entrySet)
        @getSections(_.extend(options,{entrySet: entrySet}))



    getSections:(options)->
      sections = App.request "entry:set:sections:entities", options
      
      App.execute "when:fetched", sections, =>
        section = sections.getCurrentSection()
        @showSectionsNavigation(sections, options.entrySet)
        unless sections.length is 0
          @executeFields(model: sections.getCurrentSection())
        else
          
    

    executeFields:(options)->
      App.execute "show:settings:section:fields", 
        _.extend options, region: @getSectionContentRegion(), loaderRegion: @getEntryFieldsRegion()

      @showTitle(options.model)

      
    executeSidebar:(options) ->
      App.execute "show:settings:sidebar:fields",
        _.extend options, region: @getSidebarRegion()
        


    showSectionsNavigation: (sections,entrySet) ->
      view = @getNavigationView(sections)

      @show view,
        region: @getNavigationRegion()
        loading: false

      @listenTo sections ,"change:current:section", (options)=>
        @executeFields options
        App.navigate @sectionUrl(options.model),{replace:true}

      @listenTo view, "add:new:section:clicked", (view)=>
        App.execute "create:section", 
          entrySet: entrySet
          #ISSUE: #17
          section:  view.collection.newSection()
          collection: view.collection
          activeView: @getLayout()

    
    showTitle:(section) ->
      view = new List.Title model: section
      @show view,
        region: @getLayout().sectionTitleRegion
        loading: 
          loadingType: "opacity"

      @listenTo view, "edit:title",(options) =>
        App.execute "edit:section", 
          section: options.model
          activeView: @getLayout()

    showEntrySetTitle:(entrySet)->
      view = new List.Title model: entrySet

      @show view,
        region: @getLayout().entrySetTitleRegion
        loading: false
      
      @listenTo view, "edit:title",(options) =>  
        App.execute "edit:section", 
          #ISSUE: #17 section argument should be refactored according to issue 
          # model: entrySet see comment above
          section: entrySet
          activeView: @getLayout()

      @listenTo view, "remove:title",(options) =>  
        App.execute "remove:entry_set", 
          model: entrySet
   

    
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
    
    
    
    getSectionContentRegion: ->
      @getLayout().sectionContentRegion


    
    getSidebarRegion: ->
      @getLayout().entryFieldsSidebarRegion    
    
    getEntryFieldsRegion: ->
      @getLayout().entryFieldsRegion

    getLayout: (entrySet)->
      @layout ?= new List.Layout(model: entrySet)

  
    
    sectionUrl:(section)->
      params = _.values(section.pick("entry_set_id","id"))
      "settings#{Routes.entry_set_section_path(params...)}"



