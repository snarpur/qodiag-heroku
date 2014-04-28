class AddDefaultValueToFieldtypeInEntryfields < ActiveRecord::Migration
  def self.up
    change_column :entry_fields, :field_type, :string, :default => "text"
  end

  def self.down
    change_column :entry_fields, :field_type, :string, :default => nil
  end
end
