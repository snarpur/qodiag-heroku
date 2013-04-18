class CreateNationalRegisters < ActiveRecord::Migration
  def self.up
    create_table :national_registers, :id => false do |t|
      t.integer :rownumber
      t.string :kennitala
      t.string :fjolskyldunumer
      t.string :bannmerki
      t.string :nafn
      t.integer :postnumer
      t.string :heimili
      t.integer :sveitarfelag
      t.integer :lastchanged
      t.string :kyn
      t.string :hjuskaparstada
      t.string :ktmaka
      t.string :rikisfang
      t.string :faedingarstadur
      t.integer :latinn
    end
  end

  def self.down
    drop_table :national_registers
  end
end
