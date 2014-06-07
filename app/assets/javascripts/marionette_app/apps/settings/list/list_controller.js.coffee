@Qapp.module "SettingsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Controller extends App.Controllers.Base

    listSettings: (options)->
      {subView,@region} = options
      settings = App.request "get:settings", options

      @showHeader(settings.getCurrentSetting())
      
      @showNavigation(settings)
 

    
    showNavigation: (settings) ->
      navigationView = @getNavigationView(settings)

      @show navigationView,
         region: @region
         loading:false 
    
    showHeader:(model)->
      headerRegion = App.request "content:header:region"
      headerRegion.show new List.Header model: model

      
    
    getNavigationView: (settings) ->
      new List.Navigation
        collection: settings
        itemViewOptions: 
          currentRoute: @currentRoute 
    
    
    getLayoutView: ->
      new List.Layout



