class App.Models.Base extends Backbone.Model

  initialize:=>
    @.schema = @.get('schema')?
    @

  getNestedModels:(schema,destination)=>
    base = @
    schema ?= @.schema
    destination ?= {}
    _.each(schema,(v,k) -> 
      if base.isNestedModel(v)
        destination[k] = {}
        val = base.getNestedModels(v.schema,destination[k]) #_.extend(true,{},base.getNestedModels(v.schema,destination[k]))
        destination[k] = val

    )  
    destination

  isNestedModel:(item)=>
    item?.schema? and item?.type == "NestedModel"
  
  setAttributesSuffix:(nested_attrs,json,destination)->
    base = @
    destination ?= {}
    _.each(nested_attrs,(v,k)->
        _.each(_.clone(json),(vi,ki) -> destination[ki] = vi if ki != k)
        destination["#{k}_attributes"] = _.clone(json[k])
        base.setAttributesSuffix(v,json[k],destination["#{k}_attributes"])
    ) 
    destination


  toJSON:=>
    json = $.extend(true,{},@.attributes)
    nestedModels = @getNestedModels()
    json = @setAttributesSuffix(nestedModels,json)
    
    json
