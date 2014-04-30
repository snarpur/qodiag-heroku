# TODO: Create a file for custom validation functions
do (Backbone) ->
  _.extend Backbone.Validation.validators,

   minMultichoiceOptions: (value, attr, customValue, model)=>    
      return model.get("field_type") == "multi-choice" and value.size() < customValue

@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.EntryField extends Entities.Model
    urlRoot: Routes.entry_fields_path()
    paramRoot: 'entry_field'
    blacklist:['index','editable','ok']

   
    relations:[
      {
        type: Backbone.Many
        key: 'entry_values'
        collectionType: "#{App.Qodiag.namespace}.Entities.EntryValues"
        relatedModel:->
          App.Entities.EntryValue
      },
      {
       type: Backbone.Many
       key: 'entry_field_options'
       collectionType: "#{App.Qodiag.namespace}.EntryFieldOptions"
       relatedModel:->
         App.Entities.EntryFieldOption
      }
    ]
 


    initialize:->
      
      @url = ->
        if @isNew() then @urlRoot else "#{@urlRoot}/#{@id}"


      if not _.isEmpty  @get('entry_field_options')
        @listenTo @get('entry_field_options'), "options:add", @addOption 
        @listenTo @get('entry_field_options'), "options:remove", @removeOption
        @listenTo @, "option:selected", @selectOption

      super
    
    removeOption:(model,options)->
      @get('entry_values').removeEntryFieldOption(options)
 

    addOption:(model,options)->
      @get('entry_values').addEntryFieldOption(options)
    
    
    selectOption:(model,options)->
      @get('entry_values').selectEntryFieldOption(options)
    
      


  


  class Entities.EntryFields extends Entities.Collection
    model: Entities.EntryField
    
    
    initialize:(models,options)->
      {@sectionId,@entrySetId} = options
      
      @url = -> 
        if @sectionId
          Routes.section_entry_fields_path(@sectionId)
        else
          Routes.entry_fields_path()

      super


    
    comparator:(entryField)->
      _(entryField.get('title')).capitalize()


    # mergeEntryValues:->
      # new App.Entities.EntryValues _.flatten @pluck('entry_values',true).map (i)-> i.toJSON({acceptsNested : false})

    
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
          return true  if !searchString? or searchString?.length < 3       
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


