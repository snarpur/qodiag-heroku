@Qapp.module "CollectionMixins", (CollectionMixins, App, Backbone, Marionette, $, _) ->

  CollectionMixins.NestedValidation =


    validateNested:->
      @modelCids = _.pluck @models,'cid'
      @validated = []
      @_errors = []
      
      @each (m)=>
         
        @listenTo m, "validated:invalid validated:valid", (model,msg)=>
          
          @validated.push model.cid
          if _.isEmpty(_.difference(@modelCids, @validated))
            _.each @parents,(p)=>
              p.trigger "validated:#{@parentRelationsKey}:collection", @ # {name: "flies", model:@, msg: @_errors}

        m.validateNested()
