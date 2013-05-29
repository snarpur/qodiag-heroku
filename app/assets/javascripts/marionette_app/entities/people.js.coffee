@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.Person extends Entities.Model
    urlRoot: () -> Routes.people_path()
    paramRoot: () -> 'person' 

    ageInYears:->
      moment().diff(moment(@get('dateofbirth')),'years')

  



  class Entities.People extends Entities.Collection
    model: Entities.Person
    url: -> Routes.people_path()
  
  




  API =
    getPerson:(id)->
      person = new Entities.Person id: id
      person.fetch()
      person
      
  App.reqres.setHandler "get:person:entity", (id) ->
    API.getPerson(id)
