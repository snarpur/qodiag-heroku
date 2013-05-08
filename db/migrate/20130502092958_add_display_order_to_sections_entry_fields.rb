class AddDisplayOrderToSectionsEntryFields < ActiveRecord::Migration
  def change
    add_column :sections_entry_fields, :display_order, :integer
  end
end
