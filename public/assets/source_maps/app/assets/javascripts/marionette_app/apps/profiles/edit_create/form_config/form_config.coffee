@Qapp.module "ProfilesApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  EditCreate.FormConfig = 
    subject: [
      {
        fieldType: "text"
        fieldName: "full_cpr"
        disabled: true
        fieldLabel:
          i18n: "person.full_cpr"
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
        fieldLabel:
          i18n: "person.firstname"
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
        fieldLabel:
          i18n: "person.lastname"
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
        fieldLabel:
          i18n: "person.full_cpr"
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
        fieldLabel:
          i18n: "person.firstname"
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
        fieldLabel:
          i18n: "person.lastname"
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
        fieldLabel:
          i18n: "person.sex"
        options: [
          {
            value: "male",
            label:
              i18n: "person.male"
          },
          {
            value: "female",
            label:
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
        fieldLabel:
          i18n: "terms.contact_information"
        modelName: "controller"
      },
      {
        fieldType: "text"
        fieldName: "street_1"
        fieldLabel:
          i18n: "address.street_1"
        modelName: "address"
      },
      {
        fieldType: "text"
        fieldName: "street_2"
        fieldLabel:
          i18n: "address.street_2"
        modelName: "address"
      },
      {
        fieldType: "text"
        fieldName: "zip_code"
        fieldLabel:
          i18n: "address.zip_code"
        modelName: "address"
      },
      {
        fieldType: "text"
        fieldName: "town"
        fieldLabel:
          i18n: "address.town"
        modelName: "address"
      },
      {
        fieldType: "text"
        fieldName: "phone"
        fieldLabel:
          i18n: "address.phone"
        modelName: "address"
      },
      {
        fieldType: "text"
        fieldName: "home_phone"
        fieldLabel:
          i18n: "address.home_phone"
        modelName: "address"
      }
    ]
