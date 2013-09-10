@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.Person extends Entities.Model
    urlRoot: Routes.people_path()
    paramRoot: 'person'
    relations: [
      {
        type: Backbone.One
        key: 'address'
        relatedModel: App.Entities.Address
      }
    ]
    nestedAttributeList: ['relationships']
    

    defaults: {
      "image_url_tiny":  "/assets/avatars/tiny/male.png",
      "image_url_thumb":  "/assets/avatars/thumb/male.png",
      "image_url_small":  "/assets/avatars/small/male.png",
      "image_url_medium":  "/assets/avatars/medium/male.png",
      "image_url_large":  "/assets/avatars/large/male.png"
    }
            
    initialize:->
      @blacklist = _.keys(@defaults)
      @on "change:respondents", @setRespondents
      @on "change:full_cpr", @ageInYears

      
    #FIX: Add 'respondents to the relations array'
    setRespondents:(model,value,options)->
      unless value instanceof Backbone.Collection
        @set('respondents',new Entities.People(value),{silent:true})

    ageInYears:->
      if @get('full_cpr')?
        @set("ageInYears",moment().diff(moment(@get('full_cpr').substr(0,6),"DDMMYY"),'years'))

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
