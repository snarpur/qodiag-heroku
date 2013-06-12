@Qapp.module "EntryFieldsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->
  


  class EditCreate.Field extends App.Views.ItemView
    template: "entry_fields/edit_create/templates/field"
    className: 'modal'

    templateHelpers: ->
      dialogTitle: =>
        action = if @model.isNew() then 'ný' else 'breyta'
        entity = if @model.isNew() then 'spurning' else 'spurningu'
        _("#{action} #{entity}").capitalize()
    
    triggers:
      "click button.save" : "save:clicked"
      "click button.cancel" : "dialog:close"
    
    bindings:
      '#title' : 'title',
      '#description' : 'description'

    dialog:
      title: ""
      buttons: []

    onShow:->
      @.stickit()
  






    
