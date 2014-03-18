@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.Person extends Entities.Model
    urlRoot: Routes.people_path()
    paramRoot: 'person'
    relations: [
      {
        type: Backbone.One
        key: 'address'
        relatedModel: ->
          App.Entities.Address
      },
      {
        type: Backbone.One
        key: 'user'
        relatedModel:->
          App.Entities.User
      },
      {
        type: Backbone.Many
        key: 'inverse_relationships'
        collectionType: 'Qapp.Entities.Relationships' 
        # relatedModel:->
        #   App.Entities.Relationship
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

    # validation:
    #   firstname: 
    #     required: true
    #     msg: ->
    #       I18n.t("activerecord.errors.messages.blank")
    #   lastname: 
    #     required: true
    #     msg: -> 
    #       I18n.t("activerecord.errors.messages.blank")
    #   full_cpr: 
    #     required: true
    #     msg: ->
    #       I18n.t("activerecord.errors.messages.blank")
    #   sex: 
    #     required: true
    #     msg: ->
    #       I18n.t("activerecord.errors.messages.blank")
            
    initialize:->
      super
      # @relations[1] = {type: Backbone.One, key: 'user', relatedModel: App.Entities.User}
      @blacklist = _.keys(@defaults)
      @on "change:respondents", @setRespondents
      # @on "change:full_cpr", @ageInYears

      #NOTE: We add the ageinYears to the blacklist to avoid de warning in the console
      # @blacklist.push "ageInYears"

      
    #FIX: Add 'respondents to the relations array'
    setRespondents:(model,value,options)->
      unless value instanceof Backbone.Collection
        @set('respondents',new Entities.People(value),{silent:true})

    # ageInYears:->
    #   console.log "@::",@
    #   if !!@get('age')
    #     @get('age')
      # if !!@get('full_cpr')
      #   if @get('full_cpr').substr(9,1) == "9"
      #     dateofbirth = @get('full_cpr').substr(0,4) + "19" + @get('full_cpr').substr(4,2)
      #   else
      #     dateofbirth = @get('full_cpr').substr(0,4) + "20" + @get('full_cpr').substr(4,2)
      #   @set("ageInYears",moment().diff(moment(dateofbirth,"DDMMYYYY"),'years'))

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
