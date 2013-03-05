object @person
attributes :id, :firstname, :lastname, :occupation, :workplace,:address_id
child :address do
  attributes :id, :street_1, :street_2, :town, :zip_code, :phone, :home_phone
end

node :relationships do |person|
  [
    partial("relationships/show", :object => person.find_or_build_parent_relationship_to(@responder_item.subject)),
    partial("relationships/show", :object => person.find_or_build_guardian_relationship_to(@responder_item.subject))
  ]
end

node :spouse_relationships do |person|
  [
    partial("relationships/show", :object => person.spouse_relationship_through_parenting_of_subject)

  ]
end
