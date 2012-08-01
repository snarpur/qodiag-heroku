object @person
attributes :id, :firstname, :lastname
node :respondents do |u|
  @person.respondents.map do |r|
    {:id => r.id, :firstname => r.firstname, :lastname => r.lastname}
  end
end

