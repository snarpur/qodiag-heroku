class App.Views.PatientInformationView extends Backbone.Marionette.ItemView
  className: "patient-view"
  template : "templates/patientInformationTmpl"


  onRender:()->
    @renderItemView(new App.Models.Person(@options.subject),".subject .information")
    @renderCollectionView(new App.Collections.Person(@options.parents),".parents")
    @renderAvatar(".avatar")
    @renderAvatarUpload(".upload")

  renderItemView:(model,container)=>
    subjectView = new App.Views.EditableItem({model: model})
    subjectView.on("itemEdit", @setForm)
    @insertHtml(subjectView,container)

  renderCollectionView:(collection,container)=>
    parentsView = new App.Views.EditableItemCollection({collection: collection})
    parentsView.on("itemview:itemEdit", @setForm)
    @insertHtml(parentsView,container)

  renderAvatar:(container)=>
    avatar = @options.subject.avatar
    html = '<img src="'+avatar+'" ><a href="#" onclick="$(\'#avatarUploadModal\').toggle();"><span class="icon-edit dialog"></span></a>'
    @.$(container).html(html)

  renderAvatarUpload:(container)=>
    id = @options.subject.id
    token = $("meta[name=\"csrf-token\"]").attr("content")
    form = @.$('#avatarUploadForm', container)
    form.attr('action', '/people/'+id)
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





