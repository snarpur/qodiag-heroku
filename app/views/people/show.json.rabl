object @person
attributes :id, :firstname, :lastname, :address_id, :sex, :full_cpr, :dateofbirth
node do |p|
  {:image_url => p.avatar.url(:medium)}
end
child(:address){ attributes :id,:street_1, :town}
node :respondents do |u|
  @person.respondents.map do |r|
    {:id => r.id, :firstname => r.firstname, :lastname => r.lastname}
  end
end

