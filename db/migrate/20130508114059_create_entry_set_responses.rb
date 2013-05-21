class CreateEntrySetResponses < ActiveRecord::Migration
  def change
    create_table :entry_set_responses do |t|
      t.integer :entry_set_id
      t.integer :responder_item_id

      t.timestamps
    end
  end
end
