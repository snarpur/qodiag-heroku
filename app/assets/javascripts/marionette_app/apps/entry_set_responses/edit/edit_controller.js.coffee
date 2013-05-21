@Qapp.module "EntrySetResponsesApp.Edit", (Edit, App, Backbone, Marionette, $, _) ->
  
  class Edit.Controller extends App.Controllers.Base
    
    initialize: (options) ->
      {@entrySetId,@responseId,@sectionNo} = options
      App.contentRegion.show @getLayout()
            
    
    edit: ()->
      @getSections()
   
    
    getSections:->
      options=
        sectionNo: @sectionNo
        entrySetId: @entrySetId
        responseId: @responseId

      @sectionCollection = App.request "entry:set:sections:entities", options
      
      App.execute "when:fetched", @sectionCollection, =>
        @currentSection = _.first(@sectionCollection.where({display_order: @sectionNo}))
        @showFormSteps()
        @getEntries()

    
    getEntries:->
      options=
        section_id: @currentSection.get("id")
        id: @responseId

      @responseSet = new App.Entities.EntrySetResponse(options)
      entries = @responseSet.getSectionEntries()
      App.execute "when:fetched", entries, =>
        
        @responseSet.set('entry_values',entries)
        
        if @sectionCollection.isCurrentLast()
          @responseSet.set("complete_item",1)
        
        @showForm()

      @listenTo @responseSet, "updated",() -> 
        unless @sectionCollection.isCurrentLast()
          App.vent.trigger "form:step:navigate", @forwardParams()
        else
      
    
    showFormSteps:->
      view = @getFormStepsView()
      @getFormStepsRegion().show view

    
    showForm:->
      editView = @getFormView()
      formView = App.request "form:wrapper", editView, @buttonsConfig() 
      @getFormWrapperRegion().show formView

      @listenTo formView, "form:back", ->
        App.vent.trigger "form:step:navigate", @backParams()
    
    
    getFormStepsView:->
      new Edit.FormSteps collection: @sectionCollection

    
    getFormView:->
      new Edit.Items 
        collection: @responseSet.get('entry_values')
        model: @responseSet


    getFormStepsRegion:->
      @getLayout().formStepsRegion
    
    
    getFormWrapperRegion:->
      @getLayout().formWrapperRegion

    
    buttonsConfig:->
      options =
        buttons: 
          primary: {text: 'Áfram og vista >>',order: 2}
          cancel: false
      
      if @sectionCollection.isCurrentLast()
        options.buttons.primary.text =
          "Vista og klára"
      
      unless @sectionCollection.isCurrentFirst() 
        options.buttons.back =
          order: 1
          buttonType: 'button'
          type: 'back'
          className: "btn"
          text: "<< Tilbaka"

      options

    
    forwardParams:->
      @sectionNo = @sectionNo + 1
      _.toArray(_.pick(@,"responseId","entrySetId","sectionNo"))
    
    
    backParams:->
      @sectionNo = @sectionNo - 1
      _.toArray(_.pick(@,"responseId","entrySetId","sectionNo"))
    
    
    getLayout:->
      @layout ?= new Edit.Layout
        
