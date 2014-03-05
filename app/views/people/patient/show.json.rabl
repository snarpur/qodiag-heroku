object @person
attributes :id, :firstname, :lastname, :address_id, :sex, :full_cpr, :address_id
child(:address){ attributes :id, :street_1, :street_2, :zip_code, :town, :country, :home_phone, :phone}
child :user ,:if => lambda { |item| item.is_user? } do 
  attributes :email, :person_id, :role_names
end