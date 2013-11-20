class AddColumnEntryFieldOptionToEntryValues < ActiveRecord::Migration
  def self.up
    add_column :entry_values, :entry_field_option_id, :integer
  end

  def self.down
    remove_column :entry_values, :entry_field_option_id, :integer
  end
end
