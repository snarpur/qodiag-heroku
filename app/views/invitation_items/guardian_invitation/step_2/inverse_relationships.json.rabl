object @relationship
attributes :id, :name, :relation_id, :person_id 
attributes :status => :_status
node do
  {:object_class => "relationship"}
end