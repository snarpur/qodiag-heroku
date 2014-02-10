object @responder_item
node do
 {
   :id=>"Hidden",
   :complete_item =>"Hidden",
   :subject=>
   {
     :title=>"personal_info",
     :model=>"App.Models.Base",
     :as=>"get_subject",
     :type=>"NestedModel",
     :schema=>
     {
       :id=>"Hidden",
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
       :full_cpr=>
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
       :address=>
       {
         :title=>"address_info",
         :type=>"NestedModel",
         :model=>"App.Models.Base",
         :schema=>
         {
           :id=>"Hidden",
           :street_1=>"Text",
           :street_2=>"Text",
           :town=>"Text",
           :zip_code=>"Text",
           :phone=>"Text",
           :home_phone=>"Text"
          }
        }
     }
   }
 }
end