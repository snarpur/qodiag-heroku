class App.Views.PatientInformationView extends Backbone.Marionette.ItemView
  className: "patient-view"
  template : "templates/patientInformationTmpl"


  onRender:()->
    @renderItemView(new App.Models.Person(@options.subject),".subject .information")
    @renderCollectionView(new App.Collections.Person(@options.parents),".parents")


  renderItemView:(model,container)=>
    subjectView = new App.Views.EditableItem({model: model})
    subjectView.on("itemEdit", @setForm)
    @insertHtml(subjectView,container)
    @renderAvatar(".subject .avatar", @options.subject)
    @renderAvatarUpload(".subject .upload", @options.subject.id)

  renderCollectionView:(collection,container)=>
    parentsView = new App.Views.EditableItemCollection({collection: collection})
    parentsView.on("itemview:itemEdit", @setForm)
    @insertHtml(parentsView,container)

    for person in collection.models
      @renderAvatarUpload(container, person.id)

  renderAvatar:(container, person)=>
    avatar = person.avatar
    html = '<img src="'+avatar+'" ><a href="#" onclick="$(\'.avatarUploadModal_'+person.id+'\').toggle();return false;"><span class="btn btn-mini dialog"><i class="icon-upload"></i></span></a>'
    @.$(container).html(html)

  renderAvatarUpload:(container, id)=>
    token = $("meta[name=\"csrf-token\"]").attr("content")
    form = @.$('form', container)
    form.find('.authenticity_token').val(token)

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





