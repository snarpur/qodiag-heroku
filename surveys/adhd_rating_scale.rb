ratings = ["never", "sometimes","often","everyday"]
inattention = [
  "Fails to give close attention to details or makes careless mistakes in schoolwork/homework",
  "Has difficulty keeping attention on tasks or play activities",
  "Does not seem to listen when spoken to directly",
  "Does not follow through on instructions and fails to finishschoolwork or chores",
  "Has difficulty organizing tasks and activities",
  "Avoids or strongly dislikes tasks that require sustained mentaleffort (e.g., homework)",
  "Loses things necessary for tasks or activities (e.g., pencils,books, toys, etc)",
  "Is easily distracted by outside stimuli",
  "Is forgetful in daily activities"
  ]
impulsivity_hyperactivity = [
  "Fidgets with hands or feet or squirms in seat",
  "Leaves seat in situations in which remaining seated isexpected (e.g., dinner table)",
  "Runs about or climbs in situations where it is inappropriate",
  "Has difficulty playing quietly",
  "Is 'on the go' or acts 'driven by a motor'",
  "Talks excessively",
  "Blurts out answers to questions before the questions havebeen completed",
  "Has difficulty awaiting turn",
  "Interrupts others or intrudes on others (e.g., butts into games)"
  ]
survey "ADHD Rating Scale" do
  section "main" do
    group "inattention" do
      order = 1
      9.times do |s|
        q inattention[s], :pick => :one, :display_order => order
        ratings.each_index { |r| a ratings[r], :weight => r }
        order += 2
      end
    end
    group "impulsivity_hyperactivity" do
      order = 2
      9.times do |s|
        q impulsivity_hyperactivity[s], :pick => :one, :display_order => order
        ratings.each_index { |r| a ratings[r], :weight => r }
        order += 2
      end
    end
  end
end