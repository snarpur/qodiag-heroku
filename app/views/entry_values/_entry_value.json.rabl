object false
attributes :id, :entry_field_id, :entry_set_response_id, :string_value, :text_value, :person_id, :created_at
child :person do
  attributes :full_name
end
# child :comments => :comments do |c|
#    attributes :id, :entry_field_id, :string_value, :text_value,:entry_set_response_id, :person_id, :created_at
#    child :person do
#       attributes :full_name
#    end
# end