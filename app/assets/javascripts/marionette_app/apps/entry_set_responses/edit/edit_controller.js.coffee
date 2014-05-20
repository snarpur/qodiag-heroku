@Qapp.module "EntrySetResponsesApp.Edit", (Edit, App, Backbone, Marionette, $, _) ->
  
  class Edit.Controller extends App.Controllers.Base
    
    initialize: (options) ->
      App.contentRegion.show @getLayout()
            
    

    edit: (options)->
      @getSections(options)
   
    

    getSections:(options)->
      {entrySetResponseId,sectionId} = options
      current_user = App.request "get:current:user"
      @entrySetResponse = App.request "entry:set:response:entities", id: entrySetResponseId
      
      App.execute "when:fetched", @entrySetResponse, =>
        @sections = @entrySetResponse.get("entry_set").get('sections')

        if sectionId
          @sections.trigger("change:current:section", model: @sections.get(sectionId))
        
        @showFormSteps()

        @listenTo @sections, "change:current:section", () =>        
          App.navigate(@sectionUrl(),{replace: true})
          @getEntries()
        

        @getEntries()


    getEntries:->
      entries = @entrySetResponse.getSectionResponses()

      App.execute "when:fetched", entries, =>
        @entrySetResponse.set('entry_fields',entries)
        @showForm()

      
    
    
    showFormSteps:->
      view = @getFormStepsView(collection: @sections)

      @show view,
         region: @getFormStepsRegion()
         loading: false 


    
    showForm:->
      editView = @getFormView()
      formView = App.request "form:wrapper", editView, @buttonsConfig() 

      @show formView,
         region: @getFormWrapperRegion()
         loading:true 
      


      @listenTo formView, "form:back", =>
        @sections.trigger("change:current:section",{model: @sections.getPreviousSection()})
        
      
      @listenTo formView, "form:saveAndContinue", => 
        @saveAndMoveToNextSection(formView)
      
      @listenTo formView, "form:saveAndComplete", => 
        @saveAsCompleteAndRedirect(formView)
    

    saveAsCompleteAndRedirect:(formView) ->
      @entrySetResponse.set("entry_values",@entrySetResponse.getEntryValuesForSection())
      @entrySetResponse.set("complete_item",1)
      formView.trigger('form:submit')
      @listenToOnce @entrySetResponse, 'updated', =>
        App.navigate "/items", {trigger: true}
        toastr.success "Færsla hefur vistast"


    saveAndMoveToNextSection:(formView)->
      @entrySetResponse.set("entry_values",@entrySetResponse.getEntryValuesForSection())
      formView.trigger('form:submit')
      @listenToOnce @entrySetResponse, 'updated', =>
        @sections.trigger("change:current:section",model: @sections.getNextSection())
     
  
    getFormStepsView:(options)->
      new Edit.FormSteps _.extend options


    
    getFormView:->
      new Edit.EntryFields 
        collection: @entrySetResponse.get('entry_fields')
        model: @entrySetResponse 



    getFormStepsRegion:->
      @getLayout().formStepsRegion
    
    

    getFormWrapperRegion:->
      @getLayout().formWrapperRegion

    buttonsConfig:->
      options =
        buttons: 
          primary: {text: I18n.t("actions.save_and_continue",model: "") + " >>", buttonType: 'saveAndContinue', order: 3}
          cancel: false
     
      if @sections.isCurrentLast()
        options.buttons.primary = _.extend options.buttons.primary , {text: I18n.t("actions.save_and_complete",model: ""), buttonType: 'saveAndComplete', order: 3}
      
      unless @sections.isCurrentFirst() 
        _.extend options.buttons, back: {text: "<< " + I18n.t("terms.go_back"), buttonType: 'back', className: "btn", order: 1}
          
      
      options

    
    
    getLayout:->
      @layout ?= new Edit.Layout



    sectionUrl:->
      Routes.entry_set_response_section_path(@entrySetResponse.id,@sections.getCurrentSection().id)
        
