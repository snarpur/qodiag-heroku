class AddIndexesToSectionsEntryFields < ActiveRecord::Migration
  def self.up
    add_index :sections_entry_fields, :entry_field_id, :name => 'sections_entry_fields_index_entry_field_id'
    add_index :sections_entry_fields, :section_id, :name => 'sections_entry_fields_index_section_id'
  end

  def self.down
    remove_index :sections_entry_fields, :entry_field_id
    remove_index :sections_entry_fields, :section_id
  end
end
