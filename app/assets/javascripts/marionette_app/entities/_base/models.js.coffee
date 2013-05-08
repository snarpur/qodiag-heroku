@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
	
	class Entities.Model extends Backbone.Model
    attributeList: []
    nestedAttributeList: []

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