object false
node {|t|@timeline.dimensions}
node :surveys do |timeline|
 @timeline.surveys.map{|s| {:access_code => s.access_code, :id => s.id }}
end
node {|t|@timeline.timespan}

node :subject do |timeline|
  partial "people/show", :object => @timeline.subject
end



