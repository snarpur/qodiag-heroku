collection @entry_fields
attributes :id, :entry_field_id, :section_id

child :entry_field do
  attributes :title,:description
end