object @person
attributes :id, :firstname, :lastname
node :caretaker_id do |person|
  person.caretakers.first.id
end
node do
  {:formTemplate => "people/subjectTmpl"}
end
node :schema do
  {
    :id => :Hidden,
    :caretaker_id => :Hidden, 
    :firstname => :Text,
    :lastname => :Text
    }
end