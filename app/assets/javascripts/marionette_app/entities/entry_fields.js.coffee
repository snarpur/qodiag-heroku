@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.EntryField extends Entities.Model
    urlRoot: Routes.entry_fields_path()
    paramRoot: 'entry_field'
    blacklist:['index','editable','ok']


    initialize:->
      @initializeEntryValues()

      @url = ->
        if @isNew() then @urlRoot else "#{@urlRoot}/#{@id}"

    

    initializeEntryValues:->
      return unless @get('entry_values')? 
      unless @get('entry_values') instanceof Backbone.Collection
        @set 'entry_values', new Entities.EntryValues(@get('entry_values'), {entryField: @}, {silent: true})
      
      @on "change:entry_values", @initializeEntryValues
  




  class Entities.EntryFields extends Entities.Collection
    model: Entities.EntryField
    
    
    initialize:(models,options)->
      {@sectionId,@entrySetId} = options

      @url = -> 
        if @sectionId
          Routes.section_entry_fields_path(@sectionId)
        else
          Routes.entry_fields_path()

    

    comparator:(entryField)->
      _(entryField.get('title')).capitalize()


    #NOTE: check use
    mergeEntryValues:->
      new App.Entities.EntryValues _.flatten @pluck('entry_values').map (i)-> i.toJSON()


    
    getSearchCollection:->
      @searchCollection
    
    

    getLiveCollection:->
      @liveCollection
    
    

    createSearchCollection:(disabledIds = [])->
      unless _.isEmpty(disabledIds)
        @remove @filter (model)-> _.contains(disabledIds,model.id)
      
      @liveCollection = window.queryEngine.createLiveCollection(@models)
      @liveCollection.setComparator((entry)->
          _(entry.get('title')).capitalize()
        )
      
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
      fields = new Entities.EntryFields([],_.omit(options,'callback'))
      fields.fetch
        reset: true
      fields

 

  App.reqres.setHandler "entry:fields:entities", (options = {}) ->
    API.getEntryFieldEntities options


