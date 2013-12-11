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

  class Edit.EntryFieldText extends App.Views.ItemView
    template: "entry_set_responses/edit/templates/_text_entry_field"

    onShow:(options)->
      @bindings = {}
      @bindings["\#text_value_#{@model.get('id')}"] = {
        observe: 'entry_values',
        onGet: (value,options) ->
          @model.get('entry_values').first().get('text_value')
        onSet: (value,options) ->
          @model.get('entry_values').first().set('text_value',value,{silent: true})
          @model.get('entry_values')

      }
      @stickit()
  
  class Edit.EntryFieldString extends App.Views.ItemView
    template: "entry_set_responses/edit/templates/_string_entry_field"

    onShow:(options)->
      @bindings = {}
      @bindings["\#string_value_#{@model.get('id')}"] = {
        observe: 'entry_values',
        onGet: (value,options) ->
          @model.get('entry_values').first().get('string_value')
        onSet: (value,options) ->
          @model.get('entry_values').first().set('string_value',value,{silent: true})
          @model.get('entry_values')

      }
      @stickit()

  class Edit.EntryFieldMultiChoice extends App.Views.Layout
    template: "entry_set_responses/edit/templates/_multi_choice_entry_field"


    onBeforeRender:->
      @addRegion("optionsRegion","#field-options-#{@model.get('id')}")



    onShow:->   
      @optionsRegion.show(@getFieldOptionsView())



    getFieldOptionsView:->
      @fieldOptionsView ?= new Edit.FieldOptions
        collection: @model.get('entry_field_options')
        selectedIds: @model.get("entry_values").pluck("entry_field_option_id")
  

  class Edit.EntryFieldSingleChoice extends App.Views.ItemView
    template: "entry_set_responses/edit/templates/_single_choice_entry_field"

    
    events: 
      "click input[type=radio]" : "radioClicked"

    
    radioClicked:(event) =>
      _.first(@model.get("entry_values")).entry_field_option_id = event.currentTarget.value
  

  class Edit.EntryFields extends App.Views.CompositeView
    template: "entry_set_responses/edit/templates/entry_fields"
    className: "field"
    childViewMap:
      "text": Edit.EntryFieldText
      "string": Edit.EntryFieldString
      "multi-choice": Edit.EntryFieldMultiChoice
      "single-choice": Edit.EntryFieldSingleChoice

    
    getItemView:(options)->
      @childViewMap[options.get('field_type')] unless not options?

  

  class Edit.FieldOption extends App.Views.ItemView
    template: "entry_set_responses/edit/templates/_field_option"
    tagName: 'li'
    templateHelpers:=>
      isChecked:=>
        if _.contains(@options.selectedIds, @model.id) then "checked='checked'" else false

    events: 
      "click input[type=checkbox]" : "fieldOptionClicked"


    

    fieldOptionClicked: (event)->
      action = if event.currentTarget.checked then "add" else "remove"
      currentUser = App.request "get:current:user"
      @model.collection.trigger "options:#{action}", @model,
                                person_id: currentUser.get('person_id')
                                entry_field_option_id: @model.id
                                entry_field_id: @model.get('entry_field_id')






  class Edit.FieldOptions extends App.Views.CollectionView
    itemView: Edit.FieldOption
    tagName: 'ul'
    itemViewOptions:->
      _.pick @options, "selectedIds"















