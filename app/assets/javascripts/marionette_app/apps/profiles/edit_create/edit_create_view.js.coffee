@Qapp.module "ProfilesApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  class EditCreate.Guardian extends App.Views.ItemView
      template: "profiles/edit_create/templates/guardian"
      
      bindings:
        '#firstname' : 'firstname',
        '#lastname' : 'lastname',
        '#full_cpr' : 'full_cpr',
        '.sex' : 'sex',
        '#street_1' : 'address.street_1',
        '#street_2' : 'address.street_2',
        '#town' : 'address.town',
        '#zip_code' : 'address.zip_code',
        '#phone' : 'address.phone',
        '#home_phone' : 'address.home_phone'

      onShow:->
        @.stickit()

  
  class EditCreate.Subject extends App.Views.ItemView
      template: "profiles/edit_create/templates/subject"

      bindings:
        '#firstname' : 'firstname',
        '#lastname' : 'lastname',
        '#full_cpr' : 'full_cpr'

      onShow:->
        @.stickit()