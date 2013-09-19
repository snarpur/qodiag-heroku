@Qapp.module "EntrySetResponsesApp.Edit", (Edit, App, Backbone, Marionette, $, _) ->
  
  class Edit.Controller extends App.Controllers.Base
    
    initialize: (options) ->
      App.contentRegion.show @getLayout()
            
    

    edit: (options)->
      @getSections(options)
   
    

    getSections:(options)->
      {entrySetResponseId,sectionId} = options
    
      @entrySetResponse = App.request "entry:set:response:entities", id: entrySetResponseId
      
      App.execute "when:fetched", @entrySetResponse, =>
        @sections = @entrySetResponse.get("entry_sets_sections")
        
        if sectionId
          @sections.trigger("change:current:section", model: @sections.get(sectionId))
        
        @showFormSteps()

        @listenTo @sections, "change:current:section", () =>          
          App.navigate(@sectionUrl(),{replace: true})
          @getEntries()
  
        @getEntries()

    

    getEntries:->
      entries = @entrySetResponse.getSectionResponses()

      #NOTE: We should try to remove this when-fetched in order to remove the time it takes to show the spinner
      App.execute "when:fetched", entries, =>
        @entrySetResponse.set('entry_values',entries.mergeEntryValues())
        @showForm()

      
    
    
    showFormSteps:->
      view = @getFormStepsView(collection: @sections)
      
      #DELETE: When we are totally sure that the loading views works
      #@getFormStepsRegion().show view

      @show view,
         region: @getFormStepsRegion()
         loading:false 


    
    showForm:->
      editView = @getFormView()
      formView = App.request "form:wrapper", editView, @buttonsConfig() 

      #DELETE: When we are totally sure that the loading views works
      #@getFormWrapperRegion().show formView
      @show formView,
         region: @getFormWrapperRegion()
         loading:true 

      @listenTo formView, "form:back", =>
        @sections.trigger("change:current:section",{model: @sections.getPreviousSection()})
        
      @listenTo formView, "form:save", => 
        @triggerSuccessMessage(formView)
      
      @listenTo formView, "form:saveAndContinue", => 
        @saveAndMoveToNextSection(formView)
      
      @listenTo formView, "form:saveAndComplete", => 
        @saveAsCompleteAndRedirect(formView)
    


     saveAndMoveToNextSection:(formView)->
      formView.trigger('form:submit')
      @listenToOnce @entrySetResponse, 'updated', =>
        @sections.trigger("change:current:section",model: @sections.getNextSection())
     
      

    triggerSuccessMessage:(formView)->
      formView.trigger('form:submit')
      @listenToOnce @entrySetResponse, 'updated', =>
        toastr.success "Færsla hefur vistast"

    

    saveAsCompleteAndRedirect:(formView) ->
      @entrySetResponse.set("complete_item",1)
      formView.trigger('form:submit')
      @listenToOnce @entrySetResponse, 'updated', =>
        App.navigate "/items", {trigger: true}
        toastr.success "Færsla hefur vistast"


    
    getFormStepsView:(options)->
      new Edit.FormSteps _.extend options


    
    getFormView:->
      new Edit.EntryValues 
        collection: @entrySetResponse.get('entry_values')
        model: @entrySetResponse



    getFormStepsRegion:->
      @getLayout().formStepsRegion
    
    

    getFormWrapperRegion:->
      @getLayout().formWrapperRegion


    
    buttonsConfig:->
      options =
        buttons: 
          primary: {text: 'Áfram og vista >>', buttonType: 'saveAndContinue', order: 3} 
          save: {text: "Vista", buttonType: 'save', order: 2,  className: 'btn btn-success'} 
          cancel: false
     
      if @sections.isCurrentLast()
        options.buttons.primary = _.extend options.buttons.primary , {text: "Vista og klára", buttonType: 'saveAndComplete'}
      
      unless @sections.isCurrentFirst() 
        _.extend options.buttons, back: {text: "<< Tilbaka", buttonType: 'back', className: "btn",order: 1}
          
      
      options

    
    
    getLayout:->
      @layout ?= new Edit.Layout



    sectionUrl:->
      Routes.entry_set_response_section_path(@entrySetResponse.id,@sections.getCurrentSection().id)
        
