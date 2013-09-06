collection @inverse_relations
  attributes :id, :firstname, :lastname, :full_cpr, :dateofbirth
node do |p|
  {:image_url_tiny => p.avatar.url(:tiny),
   :image_url_thumb => p.avatar.url(:thumb),
   :image_url_small => p.avatar.url(:small),
   :image_url_medium => p.avatar.url(:medium),
   :image_url_large => p.avatar.url(:large)}
end
child :address do
  attributes :id, :street_1, :street_2, :zip_code, :town, :country, :home_phone, :phone
end