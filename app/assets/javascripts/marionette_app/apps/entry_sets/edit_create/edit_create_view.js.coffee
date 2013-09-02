@Qapp.module "EntrySetsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->
  


  class EditCreate.EntrySet extends App.Views.ItemView
    template: "entry_sets/edit_create/templates/entry_set"
    className: 'modal'

    templateHelpers: =>
      dialogTitle: =>
        action = if @model.isNew() then 'nýtt' else 'breyta'
        entity = if @model.isNew() then 'eyðublað' else 'eyðublaði'
        _("#{action} #{entity}").capitalize()
    
    triggers:
      "click button.save" : "save:clicked"
      "click button.cancel" : "dialog:close"
    
    bindings:
      '#name' : 'name',
      '#description' : 'description',
      '#visibility' : 'visibility'

    onShow:->
      @.stickit()

  
  






    
