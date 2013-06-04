@Qapp.module "SettingsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  class List.Controller extends App.Controllers.Base

    listSettings: (options)->
      {subView,@region} = options
      settings = App.request "get:settings", options
      # @layout = @getLayoutView()
      # App.contentRegion.show(@layout)
      # @setContentRegion()
        
      if options.subView
        @showBackNavigationView settings.getCurrentSetting()
      else
        @showNavigation(settings)
 

    
    showNavigation: (settings) ->
      navigationView = @getNavigationView(settings)
      @region.show(navigationView)
    
    

    showBackNavigationView: (model)->
      view = new List.Breadcrumb model: model
      @region.show(view)

      @listenTo view, 'back', =>
        App.navigate("/settings/#{model.get('name')}",{trigger: true})
  
    

    setContentRegion: ->
      App.reqres.setHandler "settings:content:region", =>
        @layout.settingsContentRegion

      
    
    getNavigationView: (settings) ->
      console.log "settings :: ", settings
      new List.Navigation
        collection: settings
        itemViewOptions: 
          currentRoute: @currentRoute 
    
    
    getLayoutView: ->
      new List.Layout



