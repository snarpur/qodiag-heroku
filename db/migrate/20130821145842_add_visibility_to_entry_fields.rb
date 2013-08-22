class AddVisibilityToEntryFields < ActiveRecord::Migration
  def change
    add_column :entry_fields, :visibility, :integer, :null => false, :default => 0
  end
end
