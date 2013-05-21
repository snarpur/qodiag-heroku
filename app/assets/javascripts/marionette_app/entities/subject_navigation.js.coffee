@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.SubjectNavigaion extends Entities.Model
  
  class Entities.SubjectNavigationCollection extends Entities.Collection
    model: Entities.SubjectNavigaion
    # url: -> Routes.settings_path()
  
  API =
    getNavigation: (options) ->
      {personId} = options
      models = [
        {name: "Mælingar", url: "#{Routes.person_path(personId)}", options: {external: true} }
        {name: "Saga", url: "#{Routes.person_path(personId)}/entries"}
        {name: "Persónu upplýsingar", url: "#{Routes.person_path(personId)}/information", options: {external: true}}
      ]

      new Entities.SubjectNavigationCollection models,options


  App.reqres.setHandler "get:subject:navigation", (options) ->
    API.getNavigation options
