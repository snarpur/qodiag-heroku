@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.SubjectNavigaion extends Entities.Model
    
    isActive:->
      @get('name')  == @collection.currentItemName

  class Entities.SubjectNavigationCollection extends Entities.Collection
    model: Entities.SubjectNavigaion
    initialize: (models,options) ->
      @currentItemName = options.currentItemName  
  


  API =
    getNavigation: (options) ->
      {personId} = options
      models = [
        {
          name: "timeline"
          text: I18n.t("terms.timeline")
          url: "#{Routes.person_path(personId)}"
          iconClass:'fa-bar-chart-o' 
        },
        {
          name: "entries"
          text: I18n.t("terms.history")
          url: "\##{Routes.person_path(personId)}/entries"
          iconClass:'fa-list-alt'
        },
        {
          name: "profiles"
          text: I18n.t("terms.personal_information")
          url: "\##{Routes.person_path(personId)}/profiles"
          iconClass:'fa-file-text-o'
        }
      ]

      new Entities.SubjectNavigationCollection models,options


  App.reqres.setHandler "get:subject:navigation", (options) ->
    API.getNavigation options
