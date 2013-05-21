@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.Setting extends Entities.Model
  
  class Entities.SettingsCollection extends Entities.Collection
    model: Entities.Setting
    # url: -> Routes.settings_path()
  
  API =
    setCurrentSetting: (currentSetting) ->
      new Entities.Setting currentSetting
    
    getSettingsEntities: (callBack) ->
      settings = new Entities.SettingsCollection([{name: 'entry_sets'},{name: 'entry_fields'}])
      callBack settings

  App.reqres.setHandler "set:current:setting", (currentSetting) ->
    API.setCurrentSetting currentSetting
  
  App.reqres.setHandler "get:settings", (callBack) ->
    API.getSettingsEntities callBack