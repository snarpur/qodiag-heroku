@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
	
	class Entities.Model extends Backbone.Model
    attributeList: []
    nestedAttributeList: []

    destroy: (options = {}) ->
      _.defaults options,
        wait: true
      
      @set _destroy: true
      super options
    
    isDestroyed: ->
      @get "_destroy"
    
    save: (data, options = {}) ->
      isNew = @isNew()
      
      _.defaults options,
        wait: true
        success:  _.bind(@saveSuccess, @, isNew, options.collection)
        error:    _.bind(@saveError, @)
    
      @unset "_errors"
      super data, options
    
    saveSuccess: (isNew, collection) =>
      if isNew ## model is being created
        collection.add @ if collection
        collection.trigger "model:created", @ if collection
        @trigger "created", @
      else ## model is being updated
        collection ?= @collection ## if model has collection property defined, use that if no collection option exists
        collection.trigger "model:updated", @ if collection
        @trigger "updated", @
    
    saveError: (model, xhr, options) =>
      ## set errors directly on the model unless status returned was 500 or 404
      @set _errors: $.parseJSON(xhr.responseText)?.errors unless xhr.status is 500 or xhr.status is 404



    _isBackbone:(attribute)->
      (attribute instanceof Backbone.Model or attribute instanceof Backbone.Collection)
    
    _isHelper:(key,value)->
      (_.isObject(value) and !@_inNestedAttributeList(key) and !_.endsWith(key,"_attributes")) or _.isFunction(value) 
    
    _inNestedAttributeList:(key)->
      _.contains(@nestedAttributeList, key)
    
    _inAttributeList:(key)->
       _.contains(@attributeList, key)
    
    toJSON:=>
      json = $.extend(true,{},@.attributes)
      _.each(json,((v,k)->
        if @_inNestedAttributeList(k) 
          if @_isBackbone(v)
            json["#{k}_attributes"] = v.toJSON()
          else
            json["#{k}_attributes"] = v
          delete json[k]
        else if @_isHelper(k,v)
          delete json[k]

      ),@)
      json