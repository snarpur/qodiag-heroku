@Qapp.module "SubjectEntriesApp.New", (New, App, Backbone, Marionette, $, _) ->

  class New.Entry extends App.Views.ItemView
    template: "subject_entries_app/new/_entry"

    onShow:(options)->
      @bindings = {}
      @bindings["#entry_field_value_for_#{@model.get('entry_field_id')}"] = "text_value"
      @stickit()



 