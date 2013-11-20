@Qapp.module "EntrySetResponsesApp.Edit", (Edit, App, Backbone, Marionette, $, _) ->
  

  
  class Edit.Layout extends App.Views.Layout
    template: "entry_set_responses/edit/templates/layout"
    
    regions:
      formStepsRegion: "#form-steps-region"
      formWrapperRegion: "#form-wrapper-region"


      


  class Edit.FormStep extends App.Views.ItemView
    template: "entry_set_responses/edit/templates/_form_step"
    tagName: 'li'

    triggers:
      'click': "set:current:section"

    onSetCurrentSection:->
      @model.trigger("change:current:section", model: @model)

    className:->
      if @model.isCurrentSection()
        "active"


  


  class Edit.FormSteps extends App.Views.CollectionView
    itemView: Edit.FormStep
    className: 'wizard-nav'
    tagName: 'ul'

    collectionEvents: 
        'change:current:section' : ()-> @render()

  

  class Edit.EntryValueText extends App.Views.ItemView
    template: "entry_set_responses/edit/templates/_textEntryValue"

    # onShow:(options)->
    #   @bindings = {}
    #   fieldType = @model.get('field_type')+"_value"
    #   @bindings["\##{fieldType}_#{@model.get('entry_field_id')}"] = fieldType

    #   @stickit()

  class Edit.EntryValueString extends App.Views.ItemView
    template: "entry_set_responses/edit/templates/_stringEntryValue"

    onShow:(options)->
      @bindings = {}
      fieldType = @model.get('field_type')+"_value"
      @bindings["\##{fieldType}_#{@model.get('entry_field_id')}"] = fieldType

      @stickit()

  class Edit.EntryValueMultiChoice extends App.Views.ItemView
    template: "entry_set_responses/edit/templates/_multiChoiceEntryValue"

    # events: 
    #   "click input[type=checkbox]" : 


    onShow:(options)->
      @bindings = {}
      fieldType = @model.get('field_type')+"_value"
      for option in @model.get('entry_field_entry_field_options')
        @bindings["\##{fieldType}_#{option.id}"] = fieldType
      console.log "@ in multichoice::",@
      console.log "arguments in multichoice::",options
    #   @bindings = {}
    #   
    #   @bindings["\##{fieldType}_#{@model.get('entry_field_id')}"] = fieldType

    #   @stickit()

  class Edit.EntryValueSingleChoice extends App.Views.ItemView
    template: "entry_set_responses/edit/templates/_singleChoiceEntryValue"

    onShow:(options)->
      @bindings = {}
      fieldType = @model.get('field_type')+"_value"
      @bindings["\##{fieldType}_#{@model.get('entry_field_id')}"] = fieldType

      @stickit()
     
  class Edit.EntryValues extends App.Views.CompositeView
    template: "entry_set_responses/edit/templates/entryValues"
    className: "field"
    childViewMap:
      "text": Edit.EntryValueText
      "string": Edit.EntryValueString
      "multi-choice": Edit.EntryValueMultiChoice
      "single-choice": Edit.EntryValueSingleChoice

    getItemView:(options)->
      @childViewMap[options.get('field_type')] unless not options?
