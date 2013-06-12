collection @entry_sets
attributes :id, :name
node(:editable) {|entry_set| entry_set.entry_set_response.nil?}