object @entry_set
attributes :id, :name
node(:editable) {|entry_set| entry_set.entry_set_response.empty? }

child :sections do
  attributes :id,:name,:display_order
end