class ChangeScoreStartValueToDecimal < ActiveRecord::Migration
  def self.up
    change_column :scores, :start_value, :float
    change_column :scores, :end_value, :float
    change_column :scores, :value, :float
  end

  def self.down
  	change_column :scores, :start_value, :integer
  	change_column :scores, :end_value, :integer
	change_column :scores, :value, :integer
	end
end
