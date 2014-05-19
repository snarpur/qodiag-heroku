@Qapp.module "EntrySetsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  EditCreate.FormConfig = [
    {
      fieldType: "text"
      fieldName: "name"
      fieldLabel:
        i18n: "terms.title"
      validations: [
        {
          required: true,
          msg:-> 
            I18n.t("activerecord.errors.messages.blank")
        }
      ]
    },
    {
      fieldType: "text_area"
      fieldName: "description"
      fieldLabel:
        i18n: "entry_set.description"
    },
  ]