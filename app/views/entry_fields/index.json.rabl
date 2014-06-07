collection @entry_fields
attributes :id,:title, :field_type
node(:editable) {|entry_field| entry_field.sections.empty? }
# extends('entry_fields/show')