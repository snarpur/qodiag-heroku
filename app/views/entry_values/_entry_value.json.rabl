object false
attributes :id, :entry_field_id, :entry_set_response_id, :string_value, :text_value, :person_id
child :comments => :comments do
  attributes :id, :entry_field_id, :string_value, :text_value,:entry_set_response_id, :person_id
end