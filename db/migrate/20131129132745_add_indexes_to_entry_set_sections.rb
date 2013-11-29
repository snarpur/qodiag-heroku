class AddIndexesToEntrySetSections < ActiveRecord::Migration
  def self.up
    add_index :entry_sets_sections, :entry_set_id, :name => 'entry_sets_sections_index_entry_set_id'
    add_index :entry_sets_sections, :section_id, :name => 'entry_sets_sections_index_section_id'
  end

  def self.down
    remove_index :entry_sets_sections, :entry_set_id
    remove_index :entry_sets_sections, :section_id
  end
end
