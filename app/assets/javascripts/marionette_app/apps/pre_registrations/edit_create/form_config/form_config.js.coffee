@Qapp.module "PreRegistrationsApp.EditCreate", (EditCreate, App, Backbone, Marionette, $, _) ->

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
    respondent: 
      parent:
        step_1: [
          {
            fieldType: "title"
            fieldLabel:
              i18n: "forms.guardian_invitation.steps.patient_info"
            modelName: "controller"
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
          }
        ]
        step_2: [
          {
            fieldType: "title"
            fieldLabel:
              i18n: "forms.pre_registration_as_guardian_and_parent.steps.contact_info"
            modelName: "controller"
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
            modelName: "respondent"
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
            fieldName: "firstname"
            fieldLabel:
              i18n: "person.firstname"
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
        # NOTE: Code commented for FormConfig Preprocessor
        # step_3: [
        #   {
        #     fieldType: "separator"
        #     fieldLabel:
        #       i18n: "terms.personal_information"
        #     modelName: "controller"
        #   },
        #   {


        #     modelName: "controller.relation"
        #     nestedFields:
        #       modelName: "inverse_relations"
        #       field:[
        #         fieldType: 'text'
        #         fieldName: 'firstname'

        #       ]
        #   }#,
          # {
          #   fieldType: "text"
          #   fieldName: "full_cpr"
          #   fieldLabel:
          #     i18n: "person.full_cpr"
          #   modelName: "respondent"
          #   validations: [
          #     {
          #       required: true,
          #       msg:-> 
          #         I18n.t("activerecord.errors.messages.blank")
          #     }
          #   ]
          # },
          # {
          #   fieldType: "text"
          #   fieldName: "firstname"
          #   fieldLabel:
          #     i18n: "person.firstname"
          #   modelName: "respondent"
          #   validations: [
          #     {
          #       required: true,
          #       msg:-> 
          #         I18n.t("activerecord.errors.messages.blank")
          #     }
          #   ]
          # },
          # {
          #   fieldType: "text"
          #   fieldName: "lastname"
          #   fieldLabel:
          #     i18n: "person.lastname"
          #   modelName: "respondent"
          #   validations: [
          #     {
          #       required: true,
          #       msg:-> 
          #         I18n.t("activerecord.errors.messages.blank")
          #     }
          #   ]
          # },
          # {
          #   fieldType: "radio"
          #   fieldName: "sex"
          #   fieldLabel:
          #     i18n: "person.sex"
          #   modelName: "respondent"
          #   options: [
          #     {
          #       value: "male",
          #       label:
          #         i18n: "person.male"
          #     },
          #     {
          #       value: "female",
          #       label:
          #         i18n: "person.female"
          #     }
          #   ]
          #   validations: [
          #     {
          #       required: true,
          #       msg:-> 
          #         I18n.t("activerecord.errors.messages.blank")
          #     }
          #   ]
          # },
          # {
          #   fieldType: "separator"
          #   fieldLabel:
          #     i18n: "terms.contact_information"
          #   modelName: "controller"
          # },
          # {
          #   fieldType: "text"
          #   fieldName: "street_1"
          #   fieldLabel:
          #     i18n: "address.street_1"
          #   modelName: "respondent.address"
          # },
          # {
          #   fieldType: "text"
          #   fieldName: "street_2"
          #   fieldLabel:
          #     i18n: "address.street_2"
          #   modelName: "respondent.address"
          # },
          # {
          #   fieldType: "text"
          #   fieldName: "zip_code"
          #   fieldLabel:
          #     i18n: "address.zip_code"
          #   modelName: "respondent.address"
          # },
          # {
          #   fieldType: "text"
          #   fieldName: "town"
          #   fieldLabel:
          #     i18n: "address.town"
          #   modelName: "respondent.address"
          # },
          # {
          #   fieldType: "text"
          #   fieldName: "phone"
          #   fieldLabel:
          #     i18n: "address.phone"
          #   modelName: "respondent.address"
          # },
          # {
          #   fieldType: "text"
          #   fieldName: "home_phone"
          #   fieldLabel:
          #     i18n: "address.home_phone"
          #   modelName: "respondent.address"
          # }
          # ]
      guardian:
        step_1: [
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
          }
        ]
        step_2: [
          {
            fieldType: "separator"
            fieldLabel:
              i18n: "terms.personal_information"
            modelName: "controller"
          },
          {
            fieldType: "hidden"
            fieldName: "id"
            modelName: "respondent"
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
            fieldName: "firstname"
            fieldLabel:
              i18n: "person.firstname"
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