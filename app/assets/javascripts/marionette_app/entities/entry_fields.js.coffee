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

    relations: [
      {
        type: Backbone.Many
        key: 'entry_field_options'
        relatedModel: App.Entities.EntryFieldOption
      },
      {
        type: Backbone.Many
        key: 'entry_values'
        relatedModel: App.Entities.EntryValue
      }
    ]

    validation:
      title: 
        required: true
        msg: "Vantar"
      field_type: 
        required: true
        msg: "Vantar"
      entry_field_options:
        minMultichoiceOptions: 1
        msg: "At least one"


    initialize:->
      # @initializeEntryValues()

      @url = ->
        if @isNew() then @urlRoot else "#{@urlRoot}/#{@id}"

    

    # initializeEntryValues:->

    #   return unless @get('entry_values')? 
    #   unless @get('entry_values') instanceof Backbone.Collection
    #     entryValues = if _.isArray(@get('entry_values')) then @get('entry_values') else [@get('entry_values')]
    #     @set 'entry_values', new Entities.EntryValues(@get('entry_values'), {entryField: @}, {silent: true})
      
    #   @on "change:entry_values", @initializeEntryValues





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


