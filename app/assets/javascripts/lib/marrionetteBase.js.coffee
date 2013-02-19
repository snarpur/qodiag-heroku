App.Marionette ||= {}
class App.Marionette.ItemView extends Backbone.Marionette.ItemView

  serializeData:->
    @.model.attributes


# class App.Marrionette.CollectionView extends Backbone.Marionette.CollectionView

# class App.Marrionette.CompositeView extends Backbone.Marionette.CompositeView