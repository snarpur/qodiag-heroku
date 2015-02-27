@Qapp.module "Components.Form", (Form, App, Backbone, Marionette, $, _) ->

  Form.Builder = 

    buildConfig: (config, rootModel,options={}) ->
      rendered = []
      _.each config, (item)=>
        console.log " 0000000000000"
        console.info item
        if item.modelName
          currentItem = rootModel.get(item.modelName)
          console.info "currentItem",currentItem
          
          # if currentItem instanceof Backbone.Collection
          if _.has item, "nestedFields" 
            if currentItem instanceof Backbone.Collection
              console.info "current ",currentItem,item
              currentItem.each (m)=>
                modelConfig = _.clone item
                modelConfig.formModel = m
                console.log " m ",m
                @setFieldType(m, modelConfig)
                if modelConfig?.nestedFields
                  # console.log "modelConfig.nestedFields",modelConfig.nestedFields,m
                  nestedConfig = @buildConfig(_.clone(modelConfig.fields),m)
                  rendered.push(modelConfig)
                  rendered.push(nestedConfig)
                else
                  rendered.push(modelConfig)
            else 
              if currentItem.get(item.nestedFields.modelName) instanceof Backbone.Collection
                nestedCollection = currentItem.get(item.nestedFields.modelName)
                console.log "model with a nested collection"
         


      _.flatten rendered

    setFieldType:(model,options)->
      unless options.fieldType || options.fieldType == "dynamic"
        options.fieldType = model.get("field_type")
