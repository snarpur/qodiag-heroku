class AddIndexesToEntrySetResponses < ActiveRecord::Migration
  def self.up
    add_index :entry_set_responses, :entry_set_id, :name => 'index_entry_set_id'
    add_index :entry_set_responses, :responder_item_id, :name => 'index_responder_item_id'
  end

  def self.down
    remove_index :entry_set_responses, :entry_set_id
    remove_index :entry_set_responses, :responder_item_id
  end
end
