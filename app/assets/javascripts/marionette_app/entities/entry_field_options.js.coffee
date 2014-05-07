@Qapp.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  
  class Entities.EntryFieldOption extends Entities.Model
    urlRoot: "entry_field_options"
    paramRoot: 'entry_field_option'



    

  class Entities.EntryFieldOptions extends Entities.Collection
    model: Entities.EntryFieldOption
