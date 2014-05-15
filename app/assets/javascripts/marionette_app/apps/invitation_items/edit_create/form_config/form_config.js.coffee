@Qapp.module "InvitationItemsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  EditCreate.FormConfig = 
    subject:
      step_1: [
        {
          fieldType: "hidden"
          fieldName: "id"
          translationKey: ""
        },
        {
          fieldType: "date"
          fieldName: "deadline"
          translationKey: "responder_item.deadline"
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
          translationKey: "terms.personal_information"
          modelName: "controller"
        },
        {
          fieldType: "hidden"
          fieldName: "id"
          translationKey: ""
          modelName: "subject"
        },
        {
          fieldType: "text"
          fieldName: "full_cpr"
          translationKey: "person.full_cpr"
          modelName: "subject"
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
          fieldName: "email"
          translationKey: "user.email"
          modelName: "subject.user"
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
          modelName: "subject"
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
          modelName: "subject"
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
          modelName: "subject"
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
          modelName: "subject.address"
        },
        {
          fieldType: "text"
          fieldName: "street_2"
          translationKey: "address.street_2"
          modelName: "subject.address"
        },
        {
          fieldType: "text"
          fieldName: "zip_code"
          translationKey: "address.zip_code"
          modelName: "subject.address"
        },
        {
          fieldType: "text"
          fieldName: "town"
          translationKey: "address.town"
          modelName: "subject.address"
        },
        {
          fieldType: "text"
          fieldName: "phone"
          translationKey: "address.phone"
          modelName: "subject.address"
        },
        {
          fieldType: "text"
          fieldName: "home_phone"
          translationKey: "address.home_phone"
          modelName: "subject.address"
        }
      ]
    guardian:
      step_1: [
        {
          fieldType: "hidden"
          fieldName: "id"
          translationKey: ""
        },
        {
          fieldType: "date"
          fieldName: "deadline"
          translationKey: "responder_item.deadline"
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
          translationKey: "terms.personal_information"
          modelName: "controller"
        },
        {
          fieldType: "hidden"
          fieldName: "id"
          translationKey: ""
          formModel: "respondent"
        },
        {
          fieldType: "text"
          fieldName: "full_cpr"
          translationKey: "person.full_cpr"
          modelName: "respondent"
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
          fieldName: "email"
          translationKey: "user.email"
          modelName: "respondent.user"
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
          modelName: "respondent"
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
          modelName: "respondent"
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
          modelName: "respondent"
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
          modelName: "respondent.address"
        },
        {
          fieldType: "text"
          fieldName: "street_2"
          translationKey: "address.street_2"
          modelName: "respondent.address"
        },
        {
          fieldType: "text"
          fieldName: "zip_code"
          translationKey: "address.zip_code"
          modelName: "respondent.address"
        },
        {
          fieldType: "text"
          fieldName: "town"
          translationKey: "address.town"
          modelName: "respondent.address"
        },
        {
          fieldType: "text"
          fieldName: "phone"
          translationKey: "address.phone"
          modelName: "respondent.address"
        },
        {
          fieldType: "text"
          fieldName: "home_phone"
          translationKey: "address.home_phone"
          modelName: "respondent.address"
        }
      ]
      step_2: [
       {
          fieldType: "separator"
          translationKey: "forms.information_from_national_registry"
          modelName: "controller"
       },
       {
          fieldType: "select"
          fieldName: "children"
          modelName: "controller"
        },

        {
          fieldType: "separator"
          translationKey: "terms.personal_information"
          modelName: "controller"
        },
        {
          fieldType: "hidden"
          fieldName: "id"
          translationKey: ""
          modelName: "subject"
        },
        {
          fieldType: "text"
          fieldName: "full_cpr"
          translationKey: "person.full_cpr"
          modelName: "subject"
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
          modelName: "subject"
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
          modelName: "subject"
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
          modelName: "subject"
          options: [
            {
              id: "male",
              i18n: "person.boy"
            },
            {
              id: "female",
              i18n: "person.girl"
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
          fieldClass: App.InvitationItemsApp.EditCreate.GuardianCheck
          fieldName: "parent_guardian"
          options: [
            {
              id: "true",
              i18n: "relationship.is_parent"
            }
          ]

        }

      ]