class CreateEntrySetsSections < ActiveRecord::Migration
  def change
    create_table :entry_sets_sections do |t|
      t.integer :entry_set_id
      t.integer :section_id

      t.timestamps
    end
  end
end
