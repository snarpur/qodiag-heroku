class AddIndexesToEntryFields < ActiveRecord::Migration
  def self.up
    add_index :entry_fields, :created_by_id, :name => 'index_created_by_id'
  end

  def self.down
    remove_index :entry_fields, :created_by_id
  end
end
