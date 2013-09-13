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

  

  class Edit.EntryValue extends App.Views.ItemView
    template: "entry_set_responses/edit/templates/_entryValue"


    onShow:(options)->
      @bindings = {}
      fieldType = @model.get('field_type')+"_value"
      @bindings["\##{fieldType}_#{@model.get('entry_field_id')}"] = fieldType
      @stickit()
     


  


  class Edit.EntryValues extends App.Views.CompositeView
    template: "entry_set_responses/edit/templates/entryValues"
    itemView: Edit.EntryValue


