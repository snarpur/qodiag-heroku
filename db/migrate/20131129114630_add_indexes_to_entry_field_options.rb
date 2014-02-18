class AddIndexesToEntryFieldOptions < ActiveRecord::Migration
  def self.up
    add_index :entry_field_options, :entry_field_id, :name => 'index_entry_field_id'
  end

  def self.down
    remove_index :entry_field_options, :entry_field_id
  end
end
