# @Qapp.module "Views", (Views, App, Backbone, Marionette, $, _) ->
# @Qapp.module "Components.Form", (Form, App, Backbone, Marionette, $, _) ->
  
#   class Form.ItemFormView extends App.Views.ItemView
  
#     validation: []

#     initialize: ->
#       @model.validation = @validation
#       @extendModelEvents(@modelEvents)
#       @extendTemplateHelpers(@templateHelpers)
#       super

#     extendModelEvents:()->
#        _.extend @modelEvents, {"change:_errors"    : "changeErrors"}
    
#     serializeData:->
#       @.model.attributes

#     changeErrors: (model, errors, options) ->
#       @removeErrors()
#       @addErrors errors

#     removeErrors: ->
#       @$el.find(".error").removeClass("error")
#       @$el.find(".help-inline").text("")

#     addErrors: (errors = {}) ->
#       for name, array of errors
#         @addError name, array

#     addError: (name, error) ->
#       el = @$el.find("[id='#{name}_error']")
#       el.closest(".control-group").addClass("error")
#       el.text(error)
