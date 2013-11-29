class AddIndexesToEntrySets < ActiveRecord::Migration
  def self.up
    add_index :entry_sets, :created_by_id, :name => 'index_created_by_id_entry_sets'
  end

  def self.down
    remove_index :entry_sets, :created_by_id
  end
end
