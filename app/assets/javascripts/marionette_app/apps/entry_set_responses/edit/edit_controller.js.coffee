@Qapp.module "EntrySetResponsesApp.Edit", (Edit, App, Backbone, Marionette, $, _) ->
  
  class Edit.Controller extends App.Controllers.Base
    
    initialize: (options) ->
      App.contentRegion.show @getLayout(options)
      @executeSettingsNavigation()
            
    

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

        unless @sections.length is 0
          @listenTo @sections, "change:current:section", () =>        
            App.navigate(@sectionUrl(),{replace: true})
            @getEntries()
          

          @getEntries()


    getEntries:->
      entries = @entrySetResponse.getSectionResponses()

      App.execute "when:fetched", entries, =>
        @entrySetResponse.set('entry_fields',entries)
        @showForm()

    
    executeSettingsNavigation:() ->
      App.execute "show:settings:navigation", 
        iconClass: "fa fa-envelope"
        i18n: "views.responder_items.requests.name"
    
    
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
        toastr.success(I18n.t("entry_set.messages.entry_set_saved"))


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
        formClass: "form-base form-horizontal"
        buttons: 
          primary: {text: I18n.t("actions.save_and_continue",model: "") + " >>", className: "btn btn-info", buttonType: 'saveAndContinue', order: 3}
          cancel: false
     
      if @sections.isCurrentLast()
        options.buttons.primary = _.extend options.buttons.primary , {text: I18n.t("actions.save_and_complete",model: ""), className: "btn btn-success", buttonType: 'saveAndComplete', order: 3}
      
      unless @sections.isCurrentFirst() 
        _.extend options.buttons, back: {text: "<< " + I18n.t("terms.go_back"), buttonType: 'back', className: "btn btn-default", order: 1}
          
      
      options

    
    
    getLayout:(options)->
      @layout ?= new Edit.Layout



    sectionUrl:->
      Routes.entry_set_response_section_path(@entrySetResponse.id,@sections.getCurrentSection().id)
        
