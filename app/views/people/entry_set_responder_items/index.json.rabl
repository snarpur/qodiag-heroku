collection @responses
attributes :id, :entry_set_response_id

child :entry_set_response do
  attributes :id, :entry_set_id, :name, :responder_item_id, :section_ids
end