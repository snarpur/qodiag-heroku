class App.Views.MetricsMenuItem extends App.Marionette.ItemView
  template: 'metricsMenuItemTmpl'
  tagName: 'li'
  
  className:()->
    if @model.get('isActive') then 'active' else ''
  
  triggers:
    "click":"activate"

  initialize:->
    @on("activate", @activate)
    @listenTo(@model.collection,"change:isActive",@deActivate)


  activate:()->
    unless @model.get("isActive")
      @model.set("isActive", true)
  
  deActivate:(model)=>
    if model.cid != @model.cid
      @model.set("isActive",false, {silent:true})


class App.Views.MetricsMenuList extends App.Marionette.CollectionView
  itemView: App.Views.MetricsMenuItem
  tagName: 'ul'
  className: 'chart-metrics'