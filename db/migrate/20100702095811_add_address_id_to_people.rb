class AddAddressIdToPeople < ActiveRecord::Migration
  def self.up
    add_column :people, :address_id, :integer
  end

  def self.down
    remove_column :people, :address_id
  end
end
