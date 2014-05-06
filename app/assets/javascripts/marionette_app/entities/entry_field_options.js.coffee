@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  
  class Entities.EntryFieldOption extends Entities.Model
    paramRoot: 'entry_field_option'

    initialize: ->
      @url = ->
        Routes.entry_field_option_path(@id)
      super


    

  class Entities.EntryFieldOptions extends Entities.Collection
    model: Entities.EntryFieldOption
    