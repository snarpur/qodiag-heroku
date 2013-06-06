object @entry_field
attributes :id,:title, :description
node(:editable) {|entry_field| entry_field.entry_values.empty? }