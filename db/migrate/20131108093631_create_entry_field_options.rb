class CreateEntryFieldOptions < ActiveRecord::Migration
  def change
    create_table :entry_field_options do |t|
      t.integer :entry_field_id
      t.string :text_option

      t.timestamps
    end
  end
end
