object @person
attributes :id, :firstname, :lastname
node :responders do |u|
  @person.responders.map do |r|
    {:id => r.id, :firstname => r.firstname, :lastname => r.lastname}
  end
end

