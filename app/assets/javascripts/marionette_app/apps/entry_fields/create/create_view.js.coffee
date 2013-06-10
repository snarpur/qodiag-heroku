@Qapp.module "EntryFieldsApp.Create", (Create, App, Backbone, Marionette, $, _) ->
  


  class Create.Field extends App.Views.ItemView
    template: "entry_fields/create/templates/field"
    className: 'modal'
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
  






    
