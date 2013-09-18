object @person
attributes :id, :firstname, :lastname, :address_id, :sex, :full_cpr
node do |p|
  {:image_url_tiny => p.avatar.url(:tiny),
   :image_url_thumb => p.avatar.url(:thumb),
   :image_url_small => p.avatar.url(:small),
   :image_url_medium => p.avatar.url(:medium),
   :image_url_large => p.avatar.url(:large)}
end
child(:address){ attributes :id,:street_1, :town}
node :respondents do
  @person.respondents.map do |r|
    {:id => r.id, :firstname => r.firstname, :lastname => r.lastname, :full_name => r.full_name}
  end
end