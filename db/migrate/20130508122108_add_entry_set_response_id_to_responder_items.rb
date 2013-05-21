class AddEntrySetResponseIdToResponderItems < ActiveRecord::Migration
  def change
    add_column :responder_items, :entry_set_response_id, :integer
  end
end
