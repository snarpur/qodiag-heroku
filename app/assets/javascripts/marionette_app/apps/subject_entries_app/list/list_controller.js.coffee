@Qapp.module "SubjectEntriesApp.List", (List, App, Backbone, Marionette, $, _) ->

 
  class List.Controller extends App.Controllers.Base
    
    initialize:(options)->
      @person = App.request "get:person:entity", options.personId

      App.execute "when:fetched", @person, =>
        App.execute "show:subject:navigation",{person: @person, personId: options.personId, currentItemName: 'entries'}
        
      @list(options)    
    

    list:(options) ->
      {@personId, entrySetResponseId, sectionId} = options

      @showLayout @items     

      @items = App.request "get:person:entry:set:responder:items", options

      App.execute "when:fetched", @items, =>
        @showEntrySetSelect(@items)
        unless @items.size() is 0
          currentItem = if entrySetResponseId then @items.where(entry_set_response_id: entrySetResponseId)[0] else @items.first()
          @getSections(currentItem,sectionId) unless not currentItem.get("completed")?
        else

        @listenTo @getLayout(), "add:item:clicked", => @createItemSetup(collection: @items)
        
          

    getSections:(currentItem,sectionId)->
      options=
        entrySetId: currentItem.get("entry_set_response").get('entry_set_id')
        entrySetResponse: currentItem.get("entry_set_response")
        currentSectionId: sectionId

      sections = App.request "entry:set:sections:entities", options


      
      App.execute "when:fetched", sections, =>
        @showSections(sections,sections.getCurrentSection().id)
        @getEntries(sections.getCurrentSection())

    
     
    getEntries:(section)->
      entries = section.getSectionEntryResponses()
      entries.comparator = 'display_order'
      App.execute "when:fetched", entries, =>
        @showEntryFields(entries)
        
    

    showEntrySetSelect:(items)->
      selectView = new List.SelectItems(collection: items, layout: @getLayout())

      @show selectView,
         region: @getEntrySetSelectRegion()
         loading:false 

      @listenTo selectView, "childview:select:response",(view)=>
        @getSections(view.model)

    

    showSections:(sections,currentSectionId)->
      sectionsView = new List.Sections
        collection: sections

      @listenTo sectionsView, "childview:set:current:section", (view)=>
        @getEntries(view.model)
        App.navigate(@entriesUrl(view.model),{replace: false})
            
      @show sectionsView,
        region: @getSectionRegion()
        loading:false     


    showEntryFields:(entries)->
      entriesView = new List.Entries(collection: entries)

      entriesView.on "childview:show", (view)=> 
        region = @layout.addRegion view.entryValueRegionName(),"\##{view.entryValueRegionName()}" 
        
        App.execute "show:entry:values", 
          region: region 
          entryField: view.model
          entries: entries

      # @getEntrySetValuesRegion().show entriesView 
      
      @show entriesView, 
        loading:
          loadingType: "spinner"
        region: @getEntrySetValuesRegion()
        

    createItemSetup:(options = {})->
      view = App.request "create:responder:item:view", options


    
    getEntrySetValuesRegion:->
      @getLayout().entrySetValuesRegion

    
    
    getEntrySetSelectRegion:->
      @getLayout().entrySetSelectRegion
    
    

    getSectionRegion:->
      @getLayout().entrySetSectionsRegion

    
    
    showLayout: (items) ->
      App.request("default:region").show @getLayout()
    
    
    getLayout:->
      @layout ?= new List.Layout

    

    entriesUrl:(entry)->
      _("#{Routes.person_path(@personId)}/entries/#{entry.get('entrySetResponseId')}/section/#{entry.id}").ltrim('/')
