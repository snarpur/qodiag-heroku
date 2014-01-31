object false
node do
{
  :id=>"Hidden",
  :invite_respondent_user => "Hidden",
  :respondent=>{
    :title=>"information_from_national_registry",
    :model=>"App.Models.Person",
    :type=>"NestedModel",
    :fieldClass=>"floating-right",
    :schema=>
    {
      :family=>
      {
        :type=>"Select",
        :help=>"Fylla út upplýsingar miðað við upplýsingar frá Þjóðskrá",
        :template=>"field",
        :options=>[]
      },
    }
  },
  :subject=>
  {
    :title=>"personal_info",
    :model=>"App.Models.Person",
    :type=>"NestedModel",
    :as=>"get_subject",
    :schema=>
    {
      :id=>"Hidden",
      :full_cpr=>
      {
        :type=>"Text",
        :template=>"field",
        :validators=>["required"]
      },
      :firstname=>
      {
        :type=>"Text",
        :template=>"field",
        :validators=>["required"]
      },
      :lastname=>
      {
        :type=>"Text",
        :template=>"field",
        :validators=>["required"]
      },
      :sex=>
      {
        :type=>"Radio",
        :template=>"field",
        :options=>[{:val=>"female", :label=>"girl"}, {:val=>"male", :label=>"boy"}]
      },
      :inverse_relationships=>
      {
        :type=>"NestedCollection",
        :collection=>"App.Collections.Relationships",
        #DELETE: check to make sure that has no purpose
        # :as=> ["inverse_parent_relationship_as_current_subject","inverse_patient_relationship_as_current_subject","inverse_guardian_relationship_as_current_subject"],
        :schema=>
        [
          {
            :id=>"Hidden",
            :person_id=>"Hidden",
            :relation_id=>"Hidden",
            :name=>"Hidden",
            :status=>
            {
              :type=>"Checkbox",
              :template=>"checkbox"
            }
          },
          {
            :id=>"Hidden",
            :person_id=>"Hidden",
            :relation_id=>"Hidden",
            :name=>"Hidden"
          },
          {
            :id=>"Hidden",
            :person_id=>"Hidden",
            :relation_id=>"Hidden",
            :name=>"Hidden"
           },
          {
            :id=>"Hidden",
            :person_id=>"Hidden",
            :relation_id=>"Hidden",
            :name=>"Hidden"
          }
        ]
      }
    }
  }
}
end

