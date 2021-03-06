@Qapp.module "InvitationItemsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

  EditCreate.FormConfig = 
    subject:
      step_1: [
        {
          fieldType: "title"
          fieldLabel:
            i18n: "forms.guardian_invitation.steps.patient_info"
          modelName: "controller"
        },
        {
          fieldType: "separator"
          modelName: "controller"
        },
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
          fieldType: "separator"
          fieldLabel:
            i18n: "terms.personal_information"
          modelName: "controller"
        },
        {
          fieldType: "hidden"
          fieldName: "id"
          modelName: "subject"
        },
        {
          fieldType: "text"
          fieldName: "full_cpr"
          fieldLabel:
            i18n: "person.full_cpr"
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
          fieldLabel:
            i18n: "user.email"
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
          fieldLabel:
            i18n: "person.firstname"
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
          fieldLabel:
            i18n: "person.lastname"
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
          fieldLabel:
            i18n: "person.sex"
          modelName: "subject"
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
          modelName: "subject.address"
        },
        {
          fieldType: "text"
          fieldName: "street_2"
          fieldLabel:
            i18n: "address.street_2"
          modelName: "subject.address"
        },
        {
          fieldType: "text"
          fieldName: "zip_code"
          fieldLabel:
            i18n: "address.zip_code"
          modelName: "subject.address"
        },
        {
          fieldType: "text"
          fieldName: "town"
          fieldLabel:
            i18n: "address.town"
          modelName: "subject.address"
        },
        {
          fieldType: "text"
          fieldName: "phone"
          fieldLabel:
            i18n: "address.phone"
          modelName: "subject.address"
        },
        {
          fieldType: "text"
          fieldName: "home_phone"
          fieldLabel:
            i18n: "address.home_phone"
          modelName: "subject.address"
        }
      ]
    guardian:
      step_1: [
        {
          fieldType: "title"
          fieldLabel:
            i18n: "forms.guardian_invitation.steps.guardian_info"
          modelName: "controller"
        },
        {
          fieldType: "separator"
          modelName: "controller"
        },
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
          fieldType: "separator"
          fieldLabel:
            i18n: "terms.personal_information"
          modelName: "controller"
        },
        {
          fieldType: "hidden"
          fieldName: "id"
          formModel: "respondent"
        },
        {
          fieldType: "text"
          fieldName: "full_cpr"
          fieldLabel:
            i18n: "person.full_cpr"
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
          fieldLabel:
            i18n: "user.email"

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
          fieldLabel:
            i18n:"person.firstname"
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
          fieldLabel:
            i18n: "person.lastname"
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
          fieldLabel:
            i18n: "person.sex"
          modelName: "respondent"
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
          modelName: "respondent.address"
        },
        {
          fieldType: "text"
          fieldName: "street_2"
          fieldLabel:
            i18n: "address.street_2"
          modelName: "respondent.address"
        },
        {
          fieldType: "text"
          fieldName: "zip_code"
          fieldLabel:
            i18n: "address.zip_code"
          modelName: "respondent.address"
        },
        {
          fieldType: "text"
          fieldName: "town"
          fieldLabel:
            i18n: "address.town"
          modelName: "respondent.address"
        },
        {
          fieldType: "text"
          fieldName: "phone"
          fieldLabel:
            i18n: "address.phone"
          modelName: "respondent.address"
        },
        {
          fieldType: "text"
          fieldName: "home_phone"
          fieldLabel:
            i18n: "address.home_phone"
          modelName: "respondent.address"
        }
      ]
      step_2: [
        {
          fieldType: "title"
          fieldLabel:
            i18n: "forms.subject_invitation.steps.patient_info"
          modelName: "controller"
        },
       {
          fieldType: "separator"
          fieldLabel:
            i18n: "forms.information_from_national_registry"
          modelName: "controller"
       },
       {
          fieldType: "select"
          fieldName: "children"
          modelName: "controller"
          valueKey: "full_cpr"
          labelKey: 
            key: "full_name"
        },

        {
          fieldType: "separator"
          fieldLabel:
            i18n: "terms.personal_information"
          modelName: "controller"
        },
        {
          fieldType: "hidden"
          fieldName: "id"
          modelName: "subject"
        },
        {
          fieldType: "text"
          fieldName: "full_cpr"
          fieldLabel:
            i18n: "person.full_cpr"
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
          fieldLabel:
            i18n: "person.firstname"
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
          fieldLabel:
            i18n: "person.lastname"
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
          fieldLabel:
            i18n: "person.sex"
          modelName: "subject"
          options: [
            {
              value: "male",
              label:
                i18n: "person.boy"
            },
            {
              value: "female",
              label:
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
          fieldType: "check_box"
          fieldName: "inverse_relationships"
          fieldLabel:" "
          modelName: "subject.inverse_relationships"
          valueKey: "id"
          labelKey: 
            key:"name"
            i18nBase: "relationship"
            
          conditions:
            name: 'parent'
        }

      ]