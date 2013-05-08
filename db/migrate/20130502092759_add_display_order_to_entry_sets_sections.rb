class AddDisplayOrderToEntrySetsSections < ActiveRecord::Migration
  def change
    add_column :entry_sets_sections, :display_order, :integer
  end
end
