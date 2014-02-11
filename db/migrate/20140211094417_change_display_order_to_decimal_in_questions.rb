class ChangeDisplayOrderToDecimalInQuestions < ActiveRecord::Migration
  def self.up
    change_column :questions, :display_order, :decimal, :precision => 10, :scale => 2
  end

  def self.down
    change_column :questions, :display_order, :integer
  end
end
