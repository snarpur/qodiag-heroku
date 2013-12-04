class AddIndexesToNationalRegisters < ActiveRecord::Migration
  def self.up
    add_index :national_registers, :kennitala, :name => 'national_registers_index_kennitala'
  end

  def self.down
    remove_index :national_registers, :kennitala
  end
end
