@Qapp.module "SettingsApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Header extends App.Views.ItemView
    template: "settings/list/templates/header"
    className: "state-overview"
