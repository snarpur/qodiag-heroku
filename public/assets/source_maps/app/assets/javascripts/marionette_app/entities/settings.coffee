@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.Setting extends Entities.Model
  
  



  class Entities.SettingsCollection extends Entities.Collection
    model: Entities.Setting
    rootSetting: 'entry_sets'
    
    initialize:(models,options)->
      {@currentSetting, @subView} = options



    getCurrentSetting:()->
      setting = @findWhere({name: @currentSetting ? @rootSetting})
      setting.set 'subView', @subView if @subView
      setting
  




  API =
    setCurrentSetting: (currentSetting) ->
      new Entities.Setting currentSetting
    
    getSettingsEntities: (options) ->
      settings = new Entities.SettingsCollection [
        {name: 'entry_sets', text: I18n.t("entry_set.model_name_plural")},
        {name: 'entry_fields', text: I18n.t("terms.question")}
      ], options
      
      settings


  
  App.reqres.setHandler "get:settings", (options) ->
    API.getSettingsEntities options
