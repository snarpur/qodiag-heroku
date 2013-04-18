@Qapp.module "SettingsApp.List", (List, App, Backbone, Marionette, $, _) ->
  
  List.Controller =
    
    listSettings: (currentSetting)->

      App.request "get:settings", (settings) =>

        @layout = @getLayoutView()

        @layout.on "show", =>
          @showNavigation settings
          @showSetting currentSetting
 
        App.contentRegion.show @layout
    
    showNavigation: (settings) ->
      navigationView = @getNavigationView settings
      @layout.navigationRegion.show navigationView
    
    showSetting: (currentSetting) ->
      console.log currentSetting, "in settings"
      settingsApp = if currentSetting then "#{_.titleize(currentSetting)}App" else "EntrySetsApp"
      options=
        region: @layout.settingsContentRegion
      App.module(settingsApp).start(options)
    
    getSettingView: (settings) ->
      new List.Setting
        collection: settings
      
    getNavigationView: (settings) ->
      new List.Navigation
        collection: settings
    
    getLayoutView: ->
      new List.Layout