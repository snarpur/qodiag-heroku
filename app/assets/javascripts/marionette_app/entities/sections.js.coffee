 @Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.Section extends Entities.Model

    initialize: () ->

      @url= ()->
        if @isNew()
          Routes.sections_path()
        else
          Routes.section_path(@get('id'))

      super

    isCurrentSection:->
      @collection.isCurrentSection(@)

    getSectionEntryResponses: (entrySetResponseId)->
      entries = new App.Entities.EntryFields([],{})
      entries.url = Routes.entry_set_response_section_path(entrySetResponseId,@id)
      entries.fetch
        reset: true
      entries
      
  class Entities.Sections extends Entities.Collection
    model: Entities.Section
    url: -> Routes.sections_path()

    initialize:(models,options)->
      super
      # {@entrySetId,@entrySetResponse,@currentSectionId,@sectionNo} = options

      # @url = -> 
      #   Routes.entry_set_sections_path(@entrySetId)

      @on "change:current:section", (options)->
        @currentSectionId = options.model.id
        @currentSection = options.model

    isCurrentSection:(section) ->
      section.id == @getCurrentSection().id

    getCurrentSection: ->
      if @currentSectionId then @get(@currentSectionId) else @first()

    setCurrentToLast:->
      @sectionNo = @last().get("display_order")

    isCurrentLast:->
      @currentDisplayNo() == @size()

    isCurrentFirst:->
      @currentDisplayNo() == 1

    currentDisplayNo:->
      @getCurrentSection().get('display_order')

    getNextSection:->
      @findWhere(display_order: @currentDisplayNo() + 1)

    getPreviousSection:->
      @findWhere(display_order: @currentDisplayNo() - 1)
  
  API =
    getSection:(options)->
      # console.log "--- getSection() SECTION ENTITY ---"


   
  App.reqres.setHandler "entities:section", (options) ->
    API.getSection options
