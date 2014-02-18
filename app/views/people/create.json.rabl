object @person
attributes :id, :firstname, :lastname, :address_id, :sex, :full_cpr, :address_id
node do |p|
  {:image_url_tiny => p.avatar.url(:tiny),
   :image_url_thumb => p.avatar.url(:thumb),
   :image_url_small => p.avatar.url(:small),
   :image_url_medium => p.avatar.url(:medium),
   :image_url_large => p.avatar.url(:large)}
end
child(:address){ attributes :id, :street_1, :street_2, :zip_code, :town, :country, :home_phone, :phone}
node :respondents do |u|
  @person.respondents.map do |r|
    {:id => r.id, :firstname => r.firstname, :lastname => r.lastname}
  end
end