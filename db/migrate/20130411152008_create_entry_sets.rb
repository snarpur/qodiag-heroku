class CreateEntrySets < ActiveRecord::Migration
  def change
    create_table :entry_sets do |t|
      t.string :name
      t.integer :created_by_id
      t.string :description
      t.string :type

      t.timestamps
    end
  end
end
