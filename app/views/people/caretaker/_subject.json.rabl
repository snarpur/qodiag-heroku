object @person
attributes :id, :firstname, :lastname, :full_cpr
node :avatar do |person|
  person.avatar.url(:medium)
end
node :dateofbirth do |person|
  person.dateofbirth.strftime('%d-%m-%y')
end
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
    :lastname => :Text,
    :full_cpr => :Text
  }
end
