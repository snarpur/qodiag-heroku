object false
node do
  {
    :deadline=>"Date", 
    :id=>"Hidden", 
    :registration_identifier=>"Hidden", 
    :caretaker_id=>"Hidden", 
    :respondent=> 
    {
      :model=>"App.Models.Base", 
      :type=>"NestedModel", 
      :as=>"get_respondent", 
      :schema=> 
      {
        :id=>"Hidden", 
        :full_cpr=> 
        {
          :type=>"Text", 
          :template=>"field"
        },
        :firstname=> 
        {
          :type=>"Text", 
          :template=>"field"
        }, 
        :lastname=> 
        {
          :type=>"Text", 
          :template=>"field"
        }, 
        :sex=>
        {
          :type=>"Radio", 
          :template=>"field", 
          :options=>[{:val=>"female", :label=>"female"}, {:val=>"male", :label=>"male"}]
        },
        :user=> 
        {
          :as=>"user_invitation", 
          :model=>"App.Models.Base", 
          :type=>"NestedModel", 
          :schema=>
          {
            :id=>"Hidden", 
            :email=>
            {
              :type=>"Text", 
              :template=>"field"
            }, 
            :invitation=>"Hidden"}
          }
        }
      }
    }
end