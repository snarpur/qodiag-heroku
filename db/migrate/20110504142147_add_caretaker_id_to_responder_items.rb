class AddCaretakerIdToResponderItems < ActiveRecord::Migration
  def self.up
    add_column :responder_items, :caretaker_id, :integer
  end

  def self.down
    remove_column :responder_items, :caretaker_id
  end
end
