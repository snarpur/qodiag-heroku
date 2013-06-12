collection @responses
attributes :id, :entry_set_response_id, :created_at, :completed

child :entry_set_response do
  attributes :id, :entry_set_id, :name, :responder_item_id, :section_ids
end