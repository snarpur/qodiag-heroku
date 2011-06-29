class AddResponseSetIdToResponderItem < ActiveRecord::Migration
  def self.up
    add_column :responder_items, :response_set_id, :integer
  end

  def self.down
    remove_column :responder_items, :response_set_id
  end
end
