class AddCreatedByIdToEntryFields < ActiveRecord::Migration
  def change
    add_column :entry_fields, :created_by_id, :integer
  end
end
