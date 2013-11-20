do (Backbone) ->
  _.extend Backbone.Model::,Backbone.Validation.mixin

@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
	 

  
  class Entities.Model extends Backbone.AssociatedModel
    attributeList: []
    nestedAttributeList: []
    blacklist:[]
    validation: {}
    

    initialize:->
      super
      @url = ()->
        base = _.result(@, 'urlRoot') ? @collection.url()
        if @id then "#{base}/#{@id}" else base

      #Validation
      @validateOnChange()
      @on("validated:valid",@onValid)
      @on("validated:invalid",@onInvalid)

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

    
    _getEntityClass:(name)->
      Entities[_(name).chain().capitalize().camelize().value()]


    _createNestedEntity:(key,value)->
      unless @_isBackbone(@get('key')) and value?
        entity = new (@_getEntityClass(key))(value)
        @set(key, entity,{silent:true})
        @listenTo entity, "change", => @trigger("change:#{key}",key,entity)


    _isBackbone:(attribute)->
      (attribute instanceof Backbone.Model or attribute instanceof Backbone.Collection)
    
    

    _isBackboneAssociation:(key)->
      _.contains(_.pluck(@relations,'key'), key)

    
    _isHelper:(key,value)->
      (_.isObject(value) and !@_inNestedAttributeList(key) and !_.endsWith(key,"_attributes")) or _.isFunction(value) 
    
    

    _inNestedAttributeList:(key)->
      _.contains(@nestedAttributeList, key)
    
    

    _inAttributeList:(key)->
       _.contains(@attributeList, key)
  
    

    _inBlacklist:(key)->
        _.contains(@blacklist, key)

    #Validation functions

    onValid:(model,errors)->
      model.set("_errors",null)

    onInvalid:(model,errors)->
      model.set("_errors",errors)

    validateOnChange:->
      eventStr = _.map(_.keys(@validation),(i)-> "change:#{i}").join(" ")
      @on eventStr, => @validate() if @get('_errors')?

    

    toJSON:(options)=>
      if options?.acceptsNested == false
        super
      else
        json = $.extend(true,{},@.attributes)
        _.each(json,((v,k)->
          if (@_inNestedAttributeList(k) or @_isBackboneAssociation(k)) and !(_.isNull(v) or v?.length is 0)
            if @_isBackbone(v) and 
              json["#{k}_attributes"] = v.toJSON()
            else
              json["#{k}_attributes"] = v
            delete json[k]
          else if @_isHelper(k,v) or @_inBlacklist(k)
            delete json[k]

        ),@)
        json