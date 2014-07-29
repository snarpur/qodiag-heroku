@Qapp.module "InvitationItemsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  class EditCreate.Layout extends App.Views.Layout
    template: "invitation_items/edit_create/templates/layout"
    className: "row"
    
    regions:
      formStepsRegion: "#form-steps-region"
      mainRegion: "#fields-region"

        
  class EditCreate.FormStep extends App.Views.ItemView
    template: "invitation_items/edit_create/templates/_form_step"
    tagName: 'li'

    triggers:
      'click': "change:current:step"

    className:->
      if @model.isCurrentStep()
        "current-step"

  class EditCreate.FormSteps extends App.Views.CollectionView
    itemView: EditCreate.FormStep
    className: 'stepy-titles clearfix'
    tagName: 'ul'

    collectionEvents: 
      'change:current:step' : ()-> 
        @render()
