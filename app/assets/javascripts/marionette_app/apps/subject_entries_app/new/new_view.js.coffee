@Qapp.module "SubjectEntriesApp.New", (New, App, Backbone, Marionette, $, _) ->


  # class New.Layout extends App.Views.Layout
  #   template: "subject_entries_app/new/new_layout"
    
  #   regions:
  #     entrySetSelectRegion: "#enty-set-select-region"
  #     entrySetSectionsRegion: "#entry-set-sections-region"
  #     entrySetValuesRegion: "#entry-set-values-region"

  class New.Entry extends App.Views.ItemView
    template: "subject_entries_app/new/_entry"


    onShow:(options)->
      @bindings = {}
      @bindings["#entry_field_value_for_#{@model.get('entry_field_id')}"] = "text_value"
      @stickit()

    initialize:->
      # @on "form:submit", ()->
      #   @model.validate = (attributes,options) ->
      #     if !attributes.text_value? or _.isEmpty(attributes.text_value) then {text_value: ["cannot be empty"]}


 