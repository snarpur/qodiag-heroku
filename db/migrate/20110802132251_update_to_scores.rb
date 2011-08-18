class UpdateToScores < ActiveRecord::Migration
  def self.up
    add_column :scores, :value, :int
    remove_column :scores, :average
    remove_column :scores, :standard_deviation



  end

  def self.down
    remove_column :scores, :value
  end
end
