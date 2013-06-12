do (Backbone) ->
  _sync = Backbone.sync

  Backbone.sync = (method, entity, options = {}) ->

    _.defaults options,
      type: _helper.methodMap[method]
      dataType: 'json'
      beforeSend: _.bind(methods.beforeSend,  entity)
      complete:   _.bind(methods.complete,    entity)

  
    _helper.jsonData(method,entity,options)
    _helper.ignoreProcessOnNonGet(method,entity,options)
    _helper.setUrl(entity,options)

    sync = _sync(method, entity, options)
    if !entity._fetch and method is "read"
      entity._fetch = sync
  
  methods =
    beforeSend:(xhr, options)->
      unless options.noCSRF
        token = $("meta[name=\"csrf-token\"]").attr("content")
        xhr.setRequestHeader "X-CSRF-Token", token  if token
      @trigger "sync:start", @
    
    complete: ->
      @trigger "sync:stop", @

    
  _helper =
    methodMap: 
      'create': 'POST'
      'update': 'PUT'
      'delete': 'DELETE'
      'read'  : 'GET'

    jsonData:(method, entity,options) ->
      if !options.data && entity && (method == 'create' || method == 'update')
        options.contentType = 'application/json'
        data = {}
        if entity.paramRoot
          data[entity.paramRoot] = entity.toJSON()
        else
          data = entity.toJSON()
        options.data = JSON.stringify(data)
  

    ignoreProcessOnNonGet:(method, entity, options)->
      if options.type != 'GET'
        options.processData = false

    setUrl:(entity,options)->
      if !options.url      
        options.url = @getUrl(entity) || @urlError()  

    getUrl: (object) ->
      return null  unless object and object.url
      (if _.isFunction(object.url) then object.url() else object.url)

    urlError: ->
      throw new Error("A 'url' property or function must be specified")




