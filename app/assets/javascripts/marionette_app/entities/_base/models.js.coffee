@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
	
	class Entities.Model extends Backbone.Model
    acceptsNestedAttributesFor: []
    

    _isModelOrCollection:(attribute)->
      attribute instanceof Backbone.Model or attribute instanceof Backbone.Collection
    
    _isHelper:(key,value)->
      (_.isObject(value) and !@_acceptsNestedFor(key) and !_.endsWith(key,"_attributes")) or _.isFunction(value) 
    
    _acceptsNestedFor:(key)->
      _.contains(@acceptsNestedAttributesFor, key)
    
    toJSON:=>
      json = $.extend(true,{},@.attributes)
      _.each(json,((v,k)->
        if @._isModelOrCollection(v) and @_acceptsNestedFor(k) 
          json["#{k}_attributes"] = v.toJSON()
          delete json[k]
        else if @_isHelper(k,v)
          delete json[k]

      ),@)
      json