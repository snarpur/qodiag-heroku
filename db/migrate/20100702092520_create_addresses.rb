class CreateAddresses < ActiveRecord::Migration
  def self.up
    create_table :addresses do |t|
      t.string :street_1
      t.string :street_2
      t.integer :zip_code
      t.string :town
      t.string :country
      t.string :home_phone

      t.timestamps
    end
  end

  def self.down
    drop_table :addresses
  end
end
