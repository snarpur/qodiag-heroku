ratings =  ["not true",  "somewhat true",  "certainly true"]

emotional = [
  {:order => 3, :text => "Often complains of headaches, stomach aches or sickness"},
  {:order => 8, :text => "Many worries or often seems worried"},
  {:order => 13,:text => "Often unhappy, depressed or tearful"},
  {:order => 16,:text => "Nervous or clingy in new situations, easily loses confidence"},
  {:order => 24, :text => "Many fears, easily scared"},
]

conduct = [
  {:order => 5, :text => "Often loses temper"},
  {:order => 7,  :text => "Generally well behaved, usually does what adults request", :inverted => true},
  {:order => 12, :text => "Often fights with other children or bullies them"},
  {:order => 18, :text => "Often lies or cheats"},
  {:order => 22, :text => "Steals from home or school or elsewhere"}
]

hyperactivity_inattention = [
  {:order => 2 ,  :text => "Restless, overactive, cannot stay still for long"},
  {:order => 10,  :text => "Constantly fidgeting or squirming"},
  {:order => 15,  :text => "Easily distracted, concentration wanders"},
  {:order => 21,  :text => "Thinks things out before acting", :inverted => true},
  {:order => 25,  :text => "Good attention span, sees chores or homework through to the end", :inverted => true}
]

peer_problem = [
  {:order => 6,  :text => "Rather solitary, prefers to play alone"},
  {:order => 11,  :text => "Has at least one good friend", :inverted => true},
  {:order => 14,  :text => "Generally liked by other children", :inverted => true},
  {:order => 19,  :text => "Picked on or bullied by other children"},
  {:order => 23,  :text => "Gets along better with adults than other children"}
]

prosocial_behaviour  = [
  {:order => 1,  :text => "Considerate of other people’s feelings"},
  {:order => 4,  :text => "Shares readily with other children, for example toys, food"},
  {:order => 9,  :text => "Helpful is someone is hurt, upset or feeling ill"},
  {:order => 17, :text => "Kind to younger children"},
  {:order => 20, :text => "Often volunteers to help others (parents, teachers, other children"}
]

impact_supplement  = [
    {:order => 28,  :text => "Do the difficulties upset or distress your child? Do the difficulties interfere with your child’s everyday life in the following areas?"},
    {:order => 29,  :text => "Home life"},
    {:order => 30,  :text => "Friendships"},
    {:order => 31,  :text => "Classroom learning"},
    {:order => 32,  :text => "Leisure activities"},
    {:order => 33,  :text => "Do these difficulties put a burden on you or the family as a whole"}
]

sdq = [ {:name => "emotional", :content => emotional },
        {:name => "conduct", :content => conduct },
        {:name => "hyperactivity_inattention", :content => hyperactivity_inattention }
  ]

survey "SDQ" do
  section "main" do
    sdq.each do |sdq_group|
      group sdq_group[:name] do
        sdq_group[:content].each do |sdq_question|
         question sdq_question[:text] , :pick => :one, :display_order => sdq_question[:order]
         if sdq_question[:inverted].nil?
           ratings.each_index { |r| a ratings[r], :weight => r }
         else
           inverse = ratings.reverse
           inverse.each_index { |r| a inverse[r], :weight => r }
         end
        end
      end
    end
  end
end