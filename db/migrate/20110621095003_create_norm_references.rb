class CreateNormReferences < ActiveRecord::Migration
  def self.up
    create_table :norm_references do |t|
      t.integer :survey_id
      t.string :sex
      t.integer :age_start
      t.integer :age_end
      t.string :responder

      t.timestamps
    end
  end

  def self.down
    drop_table :norm_references
  end
end
