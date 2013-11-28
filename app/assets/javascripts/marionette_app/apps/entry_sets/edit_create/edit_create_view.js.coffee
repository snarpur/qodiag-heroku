@Qapp.module "EntrySetsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->
  


  class EditCreate.EntrySet extends App.Views.ItemView
    template: "entry_sets/edit_create/templates/entry_set"
    className: 'modal'

    templateHelpers: =>
      #REFACTOR: Try to see if we could use the Base Class template helper
      dialogTitle: =>
        action = if @model.isNew() then I18n.t("terms.new") else I18n.t("terms.edit")
        entity = if @model.isNew() then I18n.t("entry_set.model_name") else I18n.t("entry_set.model_name_accusative")
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

  
  






    
