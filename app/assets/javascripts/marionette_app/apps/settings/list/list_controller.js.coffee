@Qapp.module "SettingsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  List.Controller =
    rootRoute: "entry_sets"
    
    listSettings: (currentRoute)->
      # @stopCurrentApp()
      App.request "get:settings", (settings) =>
        @currentRoute = currentRoute ? @rootRoute
        @layout = @getLayoutView()
        @setContentRegion()
        
        @layout.on "show", =>
          @showNavigation(settings)
          # @showSetting()
 
        App.contentRegion.show(@layout)
    
    showNavigation: (settings) ->
      navigationView = @getNavigationView(settings)
      @layout.navigationRegion.show(navigationView)
    
    # showSetting: ->
    #   @startCurrentApp()
    
    setContentRegion: ->
      App.reqres.addHandler "settings:content:region", =>
        @layout.settingsContentRegion

      
    getNavigationView: (settings) ->
      new List.Navigation
        collection: settings
        itemViewOptions: 
          currentRoute: @currentRoute 
    
    getLayoutView: ->
      new List.Layout

    # startCurrentApp: (options)->
    #   @currentApp = App.module(_.camelize("_#{@currentRoute}App"))
    #   @currentApp.start()

    # stopCurrentApp: ->
    #   if @currentApp
    #     @currentApp.stop()
    #     @currentApp = null
    #   