@Qapp.module "EntrySetResponsesApp.Edit", (Edit, App, Backbone, Marionette, $, _) ->
  

  
  class Edit.Layout extends App.Views.Layout
    template: "entry_set_responses/edit/templates/layout"
    
    regions:
      formStepsRegion: "#form-steps-region"
      formWrapperRegion: "#form-wrapper-region"


  class Edit.FormStep extends App.Views.ItemView
    template: "entry_set_responses/edit/templates/_form_step"
    tagName: 'li'
    className:->
      if @model.isCurrentSection()
        "active"

  class Edit.FormSteps extends App.Views.CollectionView
    itemView: Edit.FormStep
    className: 'nav nav-pills'
    tagName: 'ul'


  class Edit.Item extends App.Views.ItemView
    template: "entry_set_responses/edit/templates/_item"
    tagName: 'li'

    
    onShow:(options)->
      @bindings = {}
      fieldType = @model.get('field_type')+"_value"
      @bindings["\##{fieldType}_#{@model.get('entry_field_id')}"] = fieldType
      @stickit()
     


  class Edit.Items extends App.Views.CompositeView
    template: "entry_set_responses/edit/templates/items"
    itemView: Edit.Item
    itemViewContainer: 'ul'

