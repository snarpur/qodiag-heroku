object @entry_value
attributes :id, :entry_field_id, :entry_set_response_id, 
           :string_value, :text_value, :person_id, :created_at,
           :entry_field_option_id

attributes :text_option => :option_value

child :person do
  attributes :full_name
end
node do |entry_value|
  {:avatar => entry_value.person.avatar.url(:tiny)}
end

