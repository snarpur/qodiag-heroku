class CreateEntryFields < ActiveRecord::Migration
  def change
    create_table :entry_fields do |t|
      t.string :title
      t.text :description
      t.string :help_text
      t.string :field_type
      t.integer :parent_field_id

      t.timestamps
    end
  end
end
