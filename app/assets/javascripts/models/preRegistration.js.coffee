class App.Models.PreRegistration extends Backbone.Model

  initialize:=>
    @.set({responder_item: new App.Models.ResponderItem(@.get("responder_item"))})
    @.urlRoot = "/pre_registrations/:responder_item_id/edit/step/"
    @.url = ()->
      base = @.urlRoot.replace(/:responder_item_id/, @responder_item_id())
      "#{base}#{'' if _.endsWith(base,'/')}#{encodeURIComponent(@.get('current_step_no'))}"

  
  responder_item_id:=>
    @.get("responder_item").get("id")


  processFormSchema:=>
    schema = @.get("schema")
    @.set('schema',@setModelSchemaReferences(schema))
    @.trigger("change:form_content")

  setModelSchemaReferences:(schema,parent_model) =>
    model = @
    _.each(schema, (v,k)->
      if v?.type == "NestedModel"
        parent_model ?= model.get("form_content")
        modelStr =  _.titleize(_.camelize(k))
        v.model = App.Models.Aliases[modelStr] ? App.Models[modelStr]
        if v?.schema
          processed_schema = model.setModelSchemaReferences(v.schema,parent_model[k])
          parent_model[k].schema = processed_schema
      )
    schema


  submitStep:=>
    formModel = @.get("formModel")
    json = formModel.toJSON()
    formModel.url = @url()
    # json.form_content = _.extend(json.form_content,rootModel)
    formModel.save(json,@submitCallbacks)
    







