@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  

  class Entities.ResponderItem extends Entities.Model
    nestedAttributeList: ['entry_set_response']
    urlRoot: Routes.responder_items_path()
    paramRoot: 'responder_item'
    
    validation:
      respondent_id: 
        required: true
        msg: "Vantar"
      subject_id: 
        required: true
        msg: "Vantar"
      deadline: 
        required: true
        msg: "Vantar"
      entry_set_response: ()-> 
        unless @get("entry_set_response").get('entry_set_id')?          
          'Vantar'
   

    labels:
      respondent_id: "Vantar"
      entry_set_response: "Vantar"
      deadline: "Vantar"
    
    

    initialize: (models,options) ->
      #NOTE: mode to _base.models
      @initAttributes()
      @validateOnChange()
      @on("validated:valid",@onValid)
      @on("validated:invalid",@onInvalid)
     

    #NOTE: mode to _base.models
    onValid:(model,errors)->
      model.set("_errors",null)

    onInvalid:(model,errors)->
      model.set("_errors",errors)


    initAttributes:(model,value)->
      if _.isEmpty(arguments)
        eventStr = _.map(@nestedAttributeList,(i)-> "change:#{i}").join(" ")
        @on(eventStr, @initAttributes)
        _.each(@nestedAttributeList,((i)-> @_createNestedEntity(i,@get(i))),@)
      else
        changed = _.invert(@changed)[value]
        @_createNestedEntity(changed,@get(changed)) if _.contains @nestedAttributeList, changed

    
    validateOnChange:->
      eventStr = _.map(_.keys(@validation),(i)-> "change:#{i}").join(" ")
      @on eventStr, => @validate() if @get('_errors')?
      

      



  class Entities.ResponderItems extends Entities.Collection
    model: Entities.ResponderItem
    
    initialize: (models,options) ->
      @personId = options.personId
      @url= ()->
        Routes.person_responder_items_path(@personId)  

    



  


  API =
    getResponderItemsForPerson: (options) ->
      items = new Entities.ResponderItems([],options)
      items.fetch
        reset: true
      items

    getEntrySetResponderItemsForPerson:(options)->
      item = new Entities.ResponderItems([],options)
      item.url = Routes.person_entry_set_items_path(options.personId)
      item.fetch
        reset: true
      item

  App.reqres.setHandler "get:person:responder:items", (options) ->
    API.getResponderItemsForPerson options


  App.reqres.setHandler "get:person:entry:set:responder:items", (options) ->
    API.getEntrySetResponderItemsForPerson options


  
