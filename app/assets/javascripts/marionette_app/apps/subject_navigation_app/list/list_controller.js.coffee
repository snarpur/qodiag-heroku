@Qapp.module "SubjectNavigationApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Controller extends App.Controllers.Base


    list:(options)->
      @items = App.request "get:subject:navigation", options
      @showNavigation()


    getNavigationRegion:->
      App.request "secondary:navigation:region"


    getNavigationView:->
      new List.Navigation
        collection: @items

    showNavigation:->
      @getNavigationRegion().show @getNavigationView()