@Qapp.module "EntryFieldsSidebarApp.List", (List, App, Backbone, Marionette, $, _) ->

 
  class List.Controller extends App.Controllers.Base


    list: (options) ->
      {@region,section} = options
      @region.show @getLayout()
      @showEntryFields(options)
      
    
    showEntryFields: (options) ->
      {droppableCollection, droppableElement} = options
      fields = App.request "entry:fields:entities"

      @listenTo droppableCollection, "change:current:dropzone", (droppable)=>
        fields.droppableElement = droppable

      App.execute "when:fetched", fields, =>
        searchCollection = fields.createSearchCollection _.result(droppableCollection,'entryFieldIds')
        fields.droppableElement = droppableElement 
         
        @listenTo droppableCollection, "remove:fields", (options)=>
          searchCollection.add(options.model.get('entry_field'))

        @showEntryFieldsView
          collection: searchCollection
          droppableCollection: droppableCollection

        @showSearchField(fields)


    getEntryFieldsView: (options) ->
      new List.EntryFields 
        collection: options.collection


    showEntryFieldsView: (options) ->
      {droppableCollection, collection} = options
      view = @getEntryFieldsView(options)

      @listenTo view, "childview:drag:stopped", (options)=>
        
        if droppableCollection.hasFieldWithId(options.model.id)
          collection.remove(options.model)
      
      @layout.listRegion.show view     




    showSearchField:(collection) ->
      @layout.searchRegion.show @getSearchFieldView(collection)

    getSearchFieldView:(collection) ->
      search = new Backbone.Model({search: ""})
      search.on("change:search",()-> collection.trigger("search:update",@.get("search")))
      new List.Search model: search

    getLayout: ->
      @layout ?= new List.Layout
        
