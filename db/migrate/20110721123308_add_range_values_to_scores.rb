class AddRangeValuesToScores < ActiveRecord::Migration
  def self.up
    add_column :scores, :start_value, :int
    add_column :scores, :end_value, :int
    add_column :scores, :result_name, :string
    remove_column :scores, :abnormal_start
    remove_column :scores, :abnormal_end
    remove_column :scores, :borderline_start
    remove_column :scores, :borderline_end
    remove_column :scores, :normal_start
    remove_column :scores, :normal_end


  end

  def self.down
    remove_column :scores, :result_name
    remove_column :scores, :end_value
    remove_column :scores, :start_value
  end
end
