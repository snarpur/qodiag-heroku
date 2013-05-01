@Qapp.module "EntryFieldsSidebarApp.List", (List, App, Backbone, Marionette, $, _) ->

 
  List.Controller = 

    listSections: (options) ->
      @region = options.region
      @region.show @getLayout()
      @showEntryFields()
      @showSearchField()
    
    showEntryFields: () ->
      options=
        callback: (collection) =>
          @collection = collection
          @searchCollection = @collection.createSearchCollection()
          @layout.listRegion.show @getEntryFieldsView(@searchCollection)
          @collection.on("drag:start",@entryDragged)

      App.request "entryFields:entities", options
      


    getEntryFieldsView: (collection) ->
      new List.EntryFields collection: collection

    showSearchField: ->
      @layout.searchRegion.show @getSearchFieldView()

    getSearchFieldView: ->
      search = new Backbone.Model({search: ""})
      _this = @
      search.on("change:search",()-> _this.collection.trigger("search:update",@.get("search")))
      new List.Search model: search

    getLayout: ->
      @layout ?= new List.Layout

    entryDragged:(entryField)->
      App.EntryFieldsSidebarApp.vent.trigger("settings:entryField:dragged",entryField)
        