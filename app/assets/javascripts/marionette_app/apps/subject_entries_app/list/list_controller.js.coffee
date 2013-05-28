@Qapp.module "SubjectEntriesApp.List", (List, App, Backbone, Marionette, $, _) ->

 
  class List.Controller extends App.Controllers.Base
    

    list:(options) ->
      {@personId, entrySetResponseId, sectionId} = options
      @showLayout()
      @items = App.request "get:person:entry:set:responder:items", options
      App.execute "when:fetched", @items, =>
        @showEntrySetSelect(@items)
        currentItem = if entrySetResponseId then @items.where(entry_set_response_id: entrySetResponseId)[0] else @items.first()
        @getSections(currentItem,sectionId) 

    
    getSections:(currentItem,sectionId)->
      options=
        entrySetId: currentItem.get("entry_set_response").entry_set_id
        responseId: currentItem.get("entry_set_response").id
        currentSectionId: sectionId

      sections = App.request "entry:set:sections:entities", options
      
      App.execute "when:fetched", sections, =>
        @showSections(sections,sections.getCurrentSection().id)
        @getEntries(sections.getCurrentSection())

    
     getEntries:(section)->
      entries = section.getSectionEntryResponses()
      App.execute "when:fetched", entries, =>
        @showEntryFields(entries)
      
    
    showEntrySetSelect:(items)->
      selectView = new List.SelectItems(collection: items)
      @getEntrySetSelectRegion().show selectView

      @listenTo selectView, "childview:select:response",(view)=>
        console.log view.model
        @getSections(view.model)



    showSections:(sections,currentSectionId)->
      sectionsView = new List.Sections
        collection: sections
            
      @getSectionRegion().show sectionsView

      @listenTo sectionsView, "childview:set:current:section", (view)=>
        @getEntries(view.model)
        App.navigate(@entriesUrl(view.model),{replace: false})

    

    showEntryFields:(entries)->
      entriesView = new List.Entries(collection: entries)
      
      @getEntrySetValuesRegion().on "show", () =>
        entriesView.children.each (view) =>

          region = @layout.addRegion view.entryValueRegionName(),"\##{view.entryValueRegionName()}" 
          App.execute "show:entry:values", 
            region: region 
            entryField: view.model
            entries: entries
      
      @getEntrySetValuesRegion().show entriesView


    getEntrySetValuesRegion:->
      @getLayout().entrySetValuesRegion

    
    getEntrySetSelectRegion:->
      @getLayout().entrySetSelectRegion
    
    getSectionRegion:->
      @getLayout().entrySetSectionsRegion

    
    showLayout: ->
      App.request("default:region").show @getLayout()

    
    getLayout:->
      @layout ?= new List.Layout

    entriesUrl:(entry)->
      _("#{Routes.person_path(@personId)}/entries/#{entry.get('responseId')}/section/#{entry.id}").ltrim('/')
