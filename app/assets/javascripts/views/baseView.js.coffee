class App.Views.Base extends Backbone.View

  template:->
    JST[@model.get('viewTemplate')]

  render:->
    console.log @el, @model.attributes
    $($(@model.get('form').el).parent()).prepend(@template()({gulli: "dindin"}))