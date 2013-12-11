@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  
  class Entities.EntryFieldOption extends Entities.Model
    paramRoot: 'entry_field_option'

    # validation:
    #   text_option: 
    #     required: true
    #     msg: "Vantar"
    
    initialize: ->
      @url = ->
        Routes.entry_field_option_path(@id)


    

  class Entities.EntryFieldOptions extends Entities.Collection
    model: Entities.EntryFieldOption
    