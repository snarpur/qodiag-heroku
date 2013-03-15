App.Marionette ||= {}
class App.Marionette.ItemView extends Backbone.Marionette.ItemView

  serializeData:->
    @.model.attributes


class App.Marionette.CollectionView extends Backbone.Marionette.CollectionView

class App.Marionette.CompositeView extends Backbone.Marionette.CompositeView