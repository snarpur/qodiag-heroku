class AddCommetableIdAndPersonIdToEntryValues < ActiveRecord::Migration
  def change
    add_column :entry_values, :person_id, :integer
    add_column :entry_values, :commentable_id, :integer
  end
end
