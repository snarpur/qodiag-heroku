object @entry_set_response
attributes :id,:entry_set_id, :name, :entry_set_name

child :entry_sets_sections do
  attributes :id, :section_name, :display_order
end