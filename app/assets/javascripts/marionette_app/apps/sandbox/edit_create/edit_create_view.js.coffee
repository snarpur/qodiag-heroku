@Qapp.module "SandboxApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  class EditCreate.Layout extends App.Views.Layout
    template: "sandbox/edit_create/templates/layout"
    
    regions:
      mainRegion: "#fields-region"