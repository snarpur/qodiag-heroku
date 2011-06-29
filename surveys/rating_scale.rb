ratings = ["never", "sometimes","often","everyday"]

survey "Rating scale" do
  section "main" do
    group "inattentive" do
      q "My bones break", :pick => :one , :display_order => 4
      ratings.each_index { |r| a ratings[r], :weight => r }

      q "My skin falls of", :pick => :one, :display_order => 2
      ratings.each_index { |r| a ratings[r], :weight => r }
    end
    group "impulsive_hyperactive" do
      q "I dress like spiderman", :pick => :one , :display_order => 1
      ratings.each_index { |r| a ratings[r], :weight => r }

      q "Aliens communicate with me through Oprah", :pick => :one, :display_order => 3
      ratings.each_index { |r| a ratings[r], :weight => r }
    end

  end
end