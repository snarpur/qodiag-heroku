collection @entries
attributes :id, :title, :field_type, :help_text
node :entry_value do |e|
  partial("entry_values/_entry_value",:object => e.get_or_initialize_entry_value(@entry_set_response_id))
end
