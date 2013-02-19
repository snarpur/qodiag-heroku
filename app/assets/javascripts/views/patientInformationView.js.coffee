class App.Views.PatientInformationView extends Backbone.Marionette.ItemView
  className: "patient-view"
  template : "templates/patientInformationTmpl"


  onRender:()->
    @renderItemView(new App.Models.Person(@options.subject),".patient")
    @renderCollectionView(new App.Collections.Person(@options.parents),".parents")

  renderItemView:(model,container)=>
    subjectView = new App.Views.EditableItem({model: model})
    subjectView.on("itemEdit", @setForm)
    @insertHtml(subjectView,container)

  renderCollectionView:(collection,container)=>
    parentsView = new App.Views.EditableItemCollection({collection: collection})
    parentsView.on("itemview:itemEdit", @setForm)
    @insertHtml(parentsView,container)

  insertHtml:(view,container)=>
    if _.isString(container)
      @.$(container).html(view.render().el)
    else
      container.replaceWith(view.render().el)

  setForm:(editableItem)=>
    form = editableItem.renderForm()
    form.on("destroy", @reset)
    editableItem.$el.replaceWith(form.el)
    editableItem.close()
  
  reset:(formView)=>
     @renderItemView(formView.model, formView.$el)
     formView.close()





