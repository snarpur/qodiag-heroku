class CreateScores < ActiveRecord::Migration
  def self.up
    create_table :scores do |t|
      t.string :name
      t.float :average
      t.float :standard_deviation
      t.float :abnormal_start
      t.float :abnormal_end
      t.float :borderline_start
      t.float :borderline_end
      t.float :normal_start
      t.float :normal_end
      t.integer :norm_reference_id

      t.timestamps
    end
  end

  def self.down
    drop_table :scores
  end
end
