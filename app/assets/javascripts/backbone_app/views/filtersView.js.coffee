class App.Views.FilterItem extends App.Marionette.ItemView
  template: 'filtersItemTmpl'
  tagName: 'li'

  
  events:
    "change select":"filter"


  filter:()->
    @model.set("normReferenceId", @$el.find(":selected").attr("id"))


class App.Views.FilterList extends App.Marionette.CollectionView
  itemView: App.Views.FilterItem
  tagName: 'ul'
  className: 'chart-filters'