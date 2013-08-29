collection @inverse_relations
  attributes :id, :firstname, :lastname, :full_cpr, :dateofbirth
node do |p|
  {:image_url => p.avatar.url(:medium)}
end
child :address do
  attributes :street_1, :street_2, :zip_code, :town, :country, :home_phone, :phone
end