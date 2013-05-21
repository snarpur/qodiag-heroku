@Qapp.module "SettingsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Controller extends App.Controllers.Base
    rootRoute: "entry_sets"
    
    listSettings: (currentRoute)->
      App.request "get:settings", (settings) =>
        @currentRoute = currentRoute ? @rootRoute
        @layout = @getLayoutView()
        @setContentRegion()
        
        @layout.on "show", =>
          @showNavigation(settings)
 
        App.contentRegion.show(@layout)
    
    showNavigation: (settings) ->
      navigationView = @getNavigationView(settings)
      @layout.navigationRegion.show(navigationView)
    
  
    setContentRegion: ->
      App.reqres.setHandler "settings:content:region", =>
        @layout.settingsContentRegion

      
    getNavigationView: (settings) ->
      new List.Navigation
        collection: settings
        itemViewOptions: 
          currentRoute: @currentRoute 
    
    getLayoutView: ->
      new List.Layout

