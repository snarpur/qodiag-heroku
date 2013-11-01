class App.Views.FilterOption extends App.Marionette.ItemView
  template: 'templates/filterOptionItemTmpl'
  tagName: 'option'

  initialize:->
    console.warn @


  
  # className:()->
  #   if @model.get('isActive') then 'active' else ''
  
  # triggers:
  #   "click":"activate"

  # initialize:->
  #   @on("activate", @activate)
  #   @listenTo(@model.collection,"change:isActive",@deActivate)


  # activate:()->
  #   unless @model.get("isActive")
  #     @model.set("isActive", true)
  
  # deActivate:(model)=>
  #   if model.cid != @model.cid
  #     @model.set("isActive",false, {silent:true})


class App.Views.Filters extends App.Marionette.CollectionView
  itemView: App.Views.FilterOption
  tagName: 'select'
  className: 'chart-filters'