do (Backbone) ->
  
  _.extend Backbone.Marionette.Application::,

    


    navigate: (route, options = {}) ->
      Backbone.history.navigate route, options
      
    routeToCaretakerBackboneApp:(currentUser)-> 
      # if _.contains(currentUser.get('role_names'), 'caretaker') and @getCurrentRoute() is null
      #   true
      # else
      false


    getCurrentRoute: ->
      frag = Backbone.history.fragment
      if _.isEmpty(frag) then null else frag
    

    rootUrl:(user)->
      rootUrls =
        caretaker: "settings"
        respondent: "items"

      
      roles = user.get('role_names')
      currentRole = _.filter(roles,(s)-> s == "caretaker" or s == "respondent")
      rootUrls[_.first(currentRole)]
    
    startHistory: ->
      if Backbone.history
        Backbone.history.start()
    
    register: (instance, id) ->
      @_registry ?= {}
      @_registry[id] = instance
    
    unregister: (instance, id) ->
      delete @_registry[id]
    
    resetRegistry: ->
      oldCount = @getRegistrySize()
      for key, controller of @_registry
        controller.region.close()
      msg = "There were #{oldCount} controllers in the registry, there are now #{@getRegistrySize()}"
      if @getRegistrySize() > 0 then console.warn(msg, @_registry) else console.log(msg)
    
    getRegistrySize: ->
      _.size @_registry