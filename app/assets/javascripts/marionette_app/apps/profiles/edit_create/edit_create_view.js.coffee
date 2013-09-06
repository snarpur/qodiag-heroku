@Qapp.module "ProfilesApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  class EditCreate.Guardian extends App.Views.ItemView
      template: "profiles/edit_create/templates/guardian"
      className: 'modal'

      templateHelpers: =>
        dialogTitle: =>
          if @model.isNew() then "Skrá upplýsingar" else "Breyta upplýsingum"
      
      triggers:
        "click button.save" : "save:clicked"
        "click button.cancel" : "dialog:close"
      
      bindings:
        '#firstname' : 'firstname',
        '#lastname' : 'lastname',
        '#full_cpr' : 'full_cpr',
        '#street_1' : 'street_1',
        '#street_2' : 'street_2',
        '#town' : 'town',
        '#zip_code' : 'zip_code',
        '#phone' : 'phone',
        '#home_phone' : 'home_phone',
        '#work_address' : 'work_address',
        '#work_phone' : 'work_phone',
        "#street_1": "address.street_1"

      dialog:
        title: ""
        buttons: []


      onShow:->
        @.stickit()