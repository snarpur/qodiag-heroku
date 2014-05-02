object @entry_field
attributes :id,:title, :description, :field_type, :help_text
node(:editable) {|entry_field| entry_field.sections.empty? }
child(:entry_field_options => :entry_field_options) { 
  attributes :id,:text_option,:entry_field_id
}