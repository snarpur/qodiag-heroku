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
          text: "Mælingar" 
          url: "#{Routes.person_path(personId)}"
          iconClass:'icon-meter' 
        },
        {
          name: "entries"
          text: "Saga"
          url: "\##{Routes.person_path(personId)}/entries"
          iconClass:'icon-history'
        },
        {
          name: "profile"
          text: "Persónu upplýsingar"
          url: "#{Routes.person_path(personId)}/edit"
          iconClass:'icon-profile'
        }
      ]

      new Entities.SubjectNavigationCollection models,options


  App.reqres.setHandler "get:subject:navigation", (options) ->
    API.getNavigation options
