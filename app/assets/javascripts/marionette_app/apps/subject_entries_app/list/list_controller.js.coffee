@Qapp.module "SubjectEntriesApp.List", (List, App, Backbone, Marionette, $, _) ->

 
  class List.Controller extends App.Controllers.Base

    
    list: (options) ->
      console.log options
      {@personId,@responderItemId,@sectionNo} = options
      @sectionNo ?= 1
      @showLayout()
      @items = App.request "get:person:entry:set:responder:items", options
      App.execute "when:fetched", @items, =>
        @showEntrySetSelect()
        @currentItem = if @responderItemId then @items.get(@responderItemId) else @items.first()
        @getSections() 

    
    getSections:->
      options=
        sectionNo: @sectionNo
        entrySetId: @currentItem.get("entry_set_response").entry_set_id
        responseId: @currentItem.get("entry_set_response").id

      sections = App.request "entry:set:sections:entities", options
      
      App.execute "when:fetched", sections, =>
        @currentSection = _.first(sections.where({display_order: @sectionNo}))
        @showSections(sections)
        @getEntries()

    
     getEntries:->
      options=
        section_id: @currentSection.get("id")
        id: @currentItem.get("entry_set_response").id

      @responseSet = new App.Entities.EntrySetResponse(options)
      entries = @responseSet.getSectionEntries()
      App.execute "when:fetched", entries, =>
        @responseSet.set('entry_values',entries)
        @showEntryFields(entries)
     
    

    showEntryFields:(entries)->
      entriesView = new List.Entries(collection: entries)
      
      
      @getEntrySetValuesRegion().on "show", () =>
        entriesView.children.each (view) =>
          region = @layout.addRegion view.entryValueRegionName(),"\##{view.entryValueRegionName()}"
          App.execute "show:entry:values", {region: region, entryValue: view.model.get("entry_value")}
      

      @getEntrySetValuesRegion().show entriesView

    
    getEntrySetValuesRegion:->
      @getLayout().entrySetValuesRegion

    
    showEntrySetSelect:->
      selectView = new List.SelectItems(collection: @items)
      @getEntrySetSelectRegion().show selectView

    
    getEntrySetSelectRegion:->
      @getLayout().entrySetSelectRegion


    showSections:(sections)->
      sectionsView = new List.Sections
        collection: sections
        itemViewOptions:
            rootUrl: "gulli"
            
      @getSectionRegion().show sectionsView

    
    getSectionRegion:->
      @getLayout().entrySetSectionsRegion

    
    showLayout: ->
      App.request("default:region").show @getLayout()

    
    getLayout:->
      @layout ?= new List.Layout