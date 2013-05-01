class CreateSectionEntryFields < ActiveRecord::Migration
  def change
    create_table :sections_entry_fields do |t|
      t.integer :entry_field_id
      t.integer :section_id
      t.timestamps
    end
  end
end
