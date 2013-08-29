@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.Person extends Entities.Model
    urlRoot: Routes.people_path()
    paramRoot: 'person' 
    nestedAttributeList: ['relationships']
            
    initialize:->
      @on "change:respondents", @setRespondents
      

    setRespondents:(model,value,options)->
      unless value instanceof Backbone.Collection
        @set('respondents',new Entities.People(value),{silent:true})

    ageInYears:->
      moment().diff(moment(@get('dateofbirth')),'years')

    getParents:->
      parents = new Entities.People([])
      parents.url = "#{Routes.inverse_relation_path(@id)}?relationship_name=parents"
      parents.fetch()
      parents





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
