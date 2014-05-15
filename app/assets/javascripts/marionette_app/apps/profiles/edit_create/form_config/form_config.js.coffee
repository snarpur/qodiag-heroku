@Qapp.module "ProfilesApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  EditCreate.FormConfig = 
    subject: [
      {
        fieldType: "text"
        fieldName: "full_cpr"
        disabled: true
        translationKey: "person.full_cpr"
        validations: [
          {
            required: true,
            msg:-> 
              I18n.t("activerecord.errors.messages.blank")
          }
        ]
      },
      {
        fieldType: "text"
        fieldName: "firstname"
        translationKey: "person.firstname"
        validations: [
          {
            required: true,
            msg:-> 
              I18n.t("activerecord.errors.messages.blank")
          }
        ]
      },
      {
        fieldType: "text"
        fieldName: "lastname"
        translationKey: "person.lastname"
        validations: [
          {
            required: true,
            msg:-> 
              I18n.t("activerecord.errors.messages.blank")
          }
        ]
      }
    ]  
    guardian: [
      {
        fieldType: "text"
        fieldName: "full_cpr"
        disabled: true
        translationKey: "person.full_cpr"
        validations: [
          {
            required: true,
            msg:-> 
              I18n.t("activerecord.errors.messages.blank")
          }
        ]
      },
      {
        fieldType: "text"
        fieldName: "firstname"
        translationKey: "person.firstname"
        validations: [
          {
            required: true,
            msg:-> I18n.t("activerecord.errors.messages.blank")
          }
        ]
      },
      {
        fieldType: "text"
        fieldName: "lastname"
        translationKey: "person.lastname"
        validations: [
          {
            required: true,
            msg:-> 
              I18n.t("activerecord.errors.messages.blank")
          }
        ]
      },
      {
        fieldType: "radio"
        fieldName: "sex"
        translationKey: "person.sex"
        options: [
          {
            id: "male",
            i18n: "person.male"
          },
          {
            id: "female",
            i18n: "person.female"
          }
        ]
        validations: [
          {
            required: true,
            msg:-> 
              I18n.t("activerecord.errors.messages.blank")
          }
        ]
      },
      {
        fieldType: "separator"
        translationKey: "terms.contact_information"
        modelName: "controller"
      },
      {
        fieldType: "text"
        fieldName: "street_1"
        translationKey: "address.street_1"
        modelName: "address"
      },
      {
        fieldType: "text"
        fieldName: "street_2"
        translationKey: "address.street_2"
        modelName: "address"
      },
      {
        fieldType: "text"
        fieldName: "zip_code"
        translationKey: "address.zip_code"
        modelName: "address"
      },
      {
        fieldType: "text"
        fieldName: "town"
        translationKey: "address.town"
        modelName: "address"
      },
      {
        fieldType: "text"
        fieldName: "phone"
        translationKey: "address.phone"
        modelName: "address"
      },
      {
        fieldType: "text"
        fieldName: "home_phone"
        translationKey: "address.home_phone"
        modelName: "address"
      }
    ]