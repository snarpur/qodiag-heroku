class AddVisibilityToEntrySets < ActiveRecord::Migration
  def change
    add_column :entry_sets, :visibility, :integer, :null => false, :default => 0
  end
end
