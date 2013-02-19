class App.Views.EditableItem extends App.Marionette.ItemView
  className: "editable-item"
  tagName: 'ul'
  events: 
    "click .edit-item": "itemEdit"

  getTemplate:=>
    App.T ||= {}
    App.T[@.cid] = @
    @model.get("formTemplate")

  renderForm:->
    new App.Views.SimpleForm({model: @model}).render()

  itemEdit:=>
    @trigger("itemEdit",@)
  
class App.Views.EditableItemCollection extends Backbone.Marionette.CompositeView

  itemView: App.Views.EditableItem
  itemViewContainer: '> div'
  
  initialize:()->
    @template = @getTemplate()

  getTemplate:()->
    childTemplate = @collection.at(0).get('formTemplate')
    childTemplate.replace(/Tmpl/,"CollectionTmpl")


    



