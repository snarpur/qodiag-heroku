@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  class Entities.Survey extends Entities.Model
    
  
  class Entities.Surveys extends Entities.Collection
    model: Entities.Survey
  

  API =
    getSurveys: (options) ->
      surveys = new Entities.Surveys
      surveys.url = Routes.all_surveys_path()
      surveys.fetch
        reset: true
      surveys


  App.reqres.setHandler "get:surveys", (options) ->
    API.getSurveys options
