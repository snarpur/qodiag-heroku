@Qapp.module "InvitationItemsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->
    
  class EditCreate.Layout extends App.Views.Layout
    template: "invitation_items/edit_create/templates/layout"
    
    regions:
      formStepsRegion: "#form-steps-region"
      formWrapperRegion: "#form-wrapper-region"
      fieldsFormRegion: "#fields-form-region"

  class EditCreate.FormLayout extends App.Views.Layout
    template: "invitation_items/edit_create/templates/form_layout"
    
    regions:
      responderItemsFieldsRegion: "#responder-items-fields-region"
      subjectGuardianFieldsRegion: "#subject-guardian-fields-region"
      userFieldsRegion: "#user-fields-region"
      addressFieldsRegion: "#address-fields-region"

  class EditCreate.FormStep extends App.Views.ItemView
    template: "invitation_items/edit_create/templates/_form_step"
    tagName: 'li'

    triggers:
      'click': "change:current:step"

    className:->
      if @model.isCurrentStep()
        "active"

  class EditCreate.FormSteps extends App.Views.CollectionView
    itemView: EditCreate.FormStep
    className: 'wizard-nav'
    tagName: 'ul'

    collectionEvents: 
      'change:current:step' : ()-> 
        @render()

  class EditCreate.FormSubjectOrGuardian extends App.Components.Form.ItemFormView
    template: "invitation_items/edit_create/templates/_form_guardian"

    bindings:
      '#firstname': "firstname",
      '#lastname':  "lastname",
      '#full_cpr':  "full_cpr",
      '.sex':       "sex" 

    validation:
      firstname: 
        required: true
        msg: -> 
          I18n.t("activerecord.errors.messages.blank")
      lastname: 
        required: true
        msg: -> 
          I18n.t("activerecord.errors.messages.blank")
      full_cpr: 
        required: true
        msg: -> 
          I18n.t("activerecord.errors.messages.blank")
      sex: 
        required: true
        msg: -> 
          I18n.t("activerecord.errors.messages.blank")

    onShow:->
      @.stickit()
    
  
  class EditCreate.FormGuardianParentCheck extends App.Components.Form.ItemFormView
    template: "invitation_items/edit_create/templates/_form_guardian_parent_check"

    bindings:
      '#is_parent': "is_parent"

    onShow:->
      @.stickit()

  class EditCreate.FormChildrenSelect extends App.Views.ItemView
    template: "invitation_items/edit_create/templates/_form_children_select"

    events:
      "change select":"changeKennitala"

    changeKennitala:(event)->
      full_cpr = $(event.target).val()
      @trigger("change:select:children",full_cpr)

    templateHelpers: =>
      children:=>
        @children.models

    initialize:(options)->
      {@children} = options

  class EditCreate.FormResponderItem extends App.Components.Form.ItemFormView
    template: "invitation_items/edit_create/templates/_form_responder_item"

    ui:
      datepick: '#deadline'

    bindings:
      '#deadline': "deadline"

    validation:
      deadline: 
        required: true
        msg: -> 
          I18n.t("activerecord.errors.messages.blank")

    onShow:->
      @.stickit()

    onRender:->
      _this = @
      @ui.datepick.datepicker
        dateFormat: "dd/mm/yy"
        minDate: new Date().addDays(1)
        beforeShow:-> 
          $('#ui-datepicker-div').addClass("invitation_calendar");

  class EditCreate.FormUser extends App.Components.Form.ItemFormView
    template: "invitation_items/edit_create/templates/_form_user"

    bindings:
      '#email': "email"


    validation:
      email: 
        required: true
        msg: -> 
          I18n.t("activerecord.errors.messages.blank")

    onShow:->
      @.stickit()
  
  class EditCreate.FormAddress extends App.Components.Form.ItemFormView
    template: "invitation_items/edit_create/templates/_form_address"

    bindings:
      '#street_1':   "street_1",
      '#street_2':   "street_2",
      '#town':       "town",
      '#zip_code':   "zip_code", 
      '#phone':      "phone", 
      '#home_phone': "home_phone"
    
    onShow:->
      @.stickit()