@Qapp.module "ResponderItemsApp.Create", (Create, App, Backbone, Marionette, $, _) ->

  Create.FormConfig = [
    {
      fieldType: "date"
      fieldName: "deadline"
      fieldLabel:
        i18n: "responder_item.deadline"
      validations: [
        {
          required: true,
          msg:-> 
            I18n.t("activerecord.errors.messages.blank")
        }
      ]
    },
    {
      fieldType: "select"
      fieldName: "respondent_id"
      valueKey: "id"
      labelKey: 
        key: "full_name"
      fieldLabel:
        i18n: "views.responder_items.select_respondents"
      validations: [
        {
          required: true,
          msg:-> 
            I18n.t("activerecord.errors.messages.blank")
        }
      ]
    },
    {
      fieldType: "select"
      modelName: "entry_set_response"
      fieldName: "entry_set_id"
      valueKey: "id"
      labelKey:
        key: "name"
      fieldLabel:
        i18n: "responder_item.entry_set"
      validations: [
        {
          required: true,
          msg:-> 
            I18n.t("activerecord.errors.messages.blank")
        }
      ]
    }
    
  ]