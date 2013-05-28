class CreateEntryValues < ActiveRecord::Migration
  def change
    create_table :entry_values do |t|
      t.integer :entry_field_id
      t.integer :entry_set_response_id
      t.string :string_value
      t.text :text_value

      t.timestamps
    end
  end
end
