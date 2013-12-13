@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.EntrySetSection extends Entities.Model
    paramRoot: 'section'
    blacklist: ['entry_set_id', 'display_order']
    nestedAttributeList: ['sections_entry_fields','entry_sets_sections']


    initialize: () ->
      if @collection?.entrySetResponseId? or @collection?.entrySetResponse?
        @set("entrySetResponseId",@collection.entrySetResponseId ? @collection.entrySetResponse.id) 

      @url= ()->
        if @isNew()
          Routes.sections_path()
        else
          Routes.section_path(@get('id'))
    

    #NOTE: We have to refactor, this function is repeated in Sections and EntrySetSections Entity
    getSectionEntryResponses:->
      entries = new App.Entities.EntryFields([],{})
      entries.url = Routes.entry_set_response_section_path(@get('entrySetResponseId'),@id)
      entries.fetch
        reset: true
      entries

    
    
    getSectionEntryFields: (callback)->
      entryFields = new App.Entities.SectionsEntryFieldsCollection([],{section: @})
      @set('sections_entry_fields',entryFields)

      unless @isNew()
        entryFields.fetch
          reset: true
      
      entryFields


    
    addSelectedField:(options) ->
      {displayOrder, field} = options
      
      model= 
        entry_field_id: field.get('id')
        section_id: @get('id')
        display_order: displayOrder
        entry_field: field.toJSON()
      
      fields = @get("sections_entry_fields")
      fields.add [model],{at: displayOrder}



    saveEntryFields: ->
      @save @pick('id','sections_entry_fields')
    


    isCurrentSection:->
      @collection.isCurrentSection(@)
    


    entryFieldIds:->
      if  @get("sections_entry_fields")
        @get("sections_entry_fields").pluck('entry_field_id')
      else
        @get('entry_field_ids')


  

  class Entities.EntrySetSections extends Entities.Collection
    model: Entities.EntrySetSection
    
    

    initialize:(models,options)->
      {@entrySetId,@entrySetResponse,@currentSectionId,@sectionNo} = options

      @url = ->
        Routes.entry_set_sections_path(@entrySetId)

      @on "change:current:section", (options)->
        @currentSectionId = options.model.id
        @currentSection = options.model
      
      

    entryFieldIds:->
      _.flatten _.map @.models, (i)->  i.entryFieldIds()


    
    hasFieldWithId: (id) ->
      _.contains(@entryFieldIds(), id)


    
    comparator:->
      @get('display_order')


    
    newSection:(args)->
      attributes= 
        entry_sets_sections: [{entry_set_id: @entrySetId, display_order: @length + 1 }]
      new @model(_.extend attributes, args)


    
    getCurrentSection: ->
      if @currentSectionId then @get(@currentSectionId) else @first()


    
    isCurrentSection:(section) ->
      section.id == @getCurrentSection().id


    
    setCurrentToLast:->
      @sectionNo = @last().get("display_order")



    isCurrentLast:->
      @currentDisplayNo() == @size()



    isCurrentFirst:->
      @currentDisplayNo() == 1



    getNextSection:->
      @findWhere(display_order: @currentDisplayNo() + 1)



    getPreviousSection:->
      @findWhere(display_order: @currentDisplayNo() - 1)


    
    currentDisplayNo:->
      @getCurrentSection().get('display_order')



    getLastDisplayNo:->
      @last().get("display_order")




    addNewSection:(args)->
      section = @newSection(args)
      @add(section,{silent:true})
      @setCurrentToLast()
      @trigger("reset")
      section

  



  API =
    getSectionEntities: (options) ->
      sections = new Entities.EntrySetSections([],options)
      sections.fetch({reset: true})
      sections

  
  App.reqres.setHandler "entry:set:sections:entities", (options) ->
    API.getSectionEntities options









