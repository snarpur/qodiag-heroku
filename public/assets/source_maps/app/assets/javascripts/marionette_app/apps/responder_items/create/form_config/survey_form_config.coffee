@Qapp.module "ResponderItemsApp.Create.Survey", (Survey, App, Backbone, Marionette, $, _) ->

  Survey.FormConfig = [
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
      fieldName: "survey_id"
      valueKey: "id"
      labelKey:
        key: "text"
      fieldLabel:
        i18n: "terms.surveys"
      validations: [
        {
          required: true,
          msg:-> 
            I18n.t("activerecord.errors.messages.blank")
        }
      ]
    }
    
  ]
