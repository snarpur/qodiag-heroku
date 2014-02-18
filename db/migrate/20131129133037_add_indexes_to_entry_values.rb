class AddIndexesToEntryValues < ActiveRecord::Migration
  def self.up
    add_index :entry_values, :entry_field_id, :name => 'entry_values_index_entry_field_id'
    add_index :entry_values, :entry_set_response_id, :name => 'entry_values_index_entry_set_response_id'
    add_index :entry_values, :person_id, :name => 'entry_values_index_person_id'
    add_index :entry_values, :commentable_id, :name => 'entry_values_index_commentable_id'
    add_index :entry_values, :entry_field_option_id, :name => 'entry_values_index_entry_field_option_id'
  end

  def self.down
    remove_index :entry_values, :entry_field_id
    remove_index :entry_values, :entry_set_response_id
    remove_index :entry_values, :person_id
    remove_index :entry_values, :commentable_id
    remove_index :entry_values, :entry_field_option_id
  end
end
