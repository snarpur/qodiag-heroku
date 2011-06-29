class ChangeDeadlineAndCompletedToDateTime < ActiveRecord::Migration
  def self.up
    change_column :responder_items, :deadline, :datetime
    change_column :responder_items, :completed, :datetime
  end

  def self.down
    change_column :responder_items, :deadline, :date
    change_column :responder_items, :completed, :date
  end
end
