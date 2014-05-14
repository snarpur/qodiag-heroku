object @entry_set_response
attributes :id :entry_set_name

child :entry_set do
  attributes :id,:name
  child :entry_sets_sections => :sections do
    attributes :display_order
    attributes :section_name => :name, :section_id => :id
  end
end
