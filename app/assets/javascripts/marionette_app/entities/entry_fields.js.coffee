@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.EntryField extends Entities.Model
  
  class Entities.EntryFieldsCollection extends Entities.Collection
    model: Entities.EntryField
    
    
    initialize:(models,options)->
      @sectionId = options.sectionId
      @entrySetId = options.entrySetId


      @url = -> 
        if @sectionId
          Routes.section_entry_fields_path(@sectionId)
        else
          Routes.entry_fields_path()


    getSearchCollection:->
      @searchCollection
    
    getLiveCollection:->
      @liveCollection
    
    createSearchCollection:->
      @liveCollection = window.queryEngine.createLiveCollection(@models)
      @on("search:update",(searchString)-> 
        @updateSearchCollection(searchString)
      )


      @searchCollection = @liveCollection.createLiveChildCollection()
        .setFilter('search', (model,searchString) ->
          return true  unless searchString?
          searchRegex = queryEngine.createSafeRegex(searchString)
          pass = searchRegex.test(model.get('title'))
          return pass
        )
        .query()

    updateSearchCollection:(searchString)->
      @searchCollection.setSearchString(searchString).query()

  API =
    getEntryFieldEntities: (options) ->
      fields = new Entities.EntryFieldsCollection([],_.omit(options,'callback'))
      callback = options.callback
      fields.fetch
        reset: true
        success: ->
          callback fields

  
  App.reqres.setHandler "sectionEntryFields:entities", (options) ->
    API.getEntryFieldEntities options

  App.reqres.setHandler "entryFields:entities", (options) ->
    API.getEntryFieldEntities options


