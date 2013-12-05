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
    #   @bindings["\#text_value_#{@model.get('id')}"] = _.first(@model.get('entry_values')).text_value

    #   @stickit()

  class Edit.EntryValueString extends App.Views.ItemView
    template: "entry_set_responses/edit/templates/_stringEntryValue"

    onShow:(options)->
      @bindings = {}
      @bindings["\#string_value_#{@model.get('id')}"] = _.first(@model.get('entry_values')).string_value

      @stickit()

  
  class Edit.EntryValueMultiChoice extends App.Views.ItemView
    template: "entry_set_responses/edit/templates/_multiChoiceEntryValue"

    events: 
      "click input[type=checkbox]" : "checkboxClicked"

    checkboxClicked:(event) =>
      if event.currentTarget.checked
        return unless @model.get("entry_values").findWhere({entry_field_option_id: (Number)(event.currentTarget.value)})?
        if @model.get("entry_values").length isnt 1 or @model.get("entry_values").at(0).get("entry_field_option_id")?
          @model.get("entry_values").unshift(@model.get("entry_values"))        
        @model.get("entry_values").at(0).set("entry_field_option_id",(Number)(event.currentTarget.value))
      else
        if @model.get("entry_values").length is 1 and @model.get("entry_values").at(0).get("entry_field_option_id")?
          @model.get("entry_values").at(0).set("entry_field_option_id",null)
        else
          @model.get("entry_values").remove(@model.get("entry_values").findWhere({entry_field_option_id: (Number)(event.currentTarget.value)}))

      # console.log "entry_values::",@model.get("entry_values").models

    onShow:(options)->
      console.log "OPTIONS : ", options, @
      # console.log "entry_values::",@model.get("entry_values")
      # console.log "pluck:: ", @model.get("entry_values").pluck("entry_field_option_id")
      # @bindings = {}
      # @bindings["input[name=multi_choice_value_#{@model.get('id')}]"] = @model.get("entry_values").pluck("entry_field_option_id")
      # console.info "bindings::",@bindings
      # @bindings = {}
      # # fieldType = @model.get('field_type')+"_value"
      # @bindings["[name=multi_choice_value_#{@model.get('id')]",@model.get('entry_values').findWhere({entry_field_option_id: option.id})?.get('entry_field_option_id')]
     
      # # @bindings["\##{fieldType}_#{@model.get('entry_field_id')}"] = fieldType

      # @stickit()

  class Edit.EntryValueSingleChoice extends App.Views.ItemView
    template: "entry_set_responses/edit/templates/_singleChoiceEntryValue"

    events: 
      "click input[type=radio]" : "radioClicked"

    radioClicked:(event) =>
      _.first(@model.get("entry_values")).entry_field_option_id = event.currentTarget.value
      

    # onShow:(options)->
    #   @bindings = {}
    #   fieldType = @model.get('field_type')+"_value"
    #   @bindings["\##{fieldType}_#{@model.get('entry_field_id')}"] = fieldType

    #   @stickit()
     
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
