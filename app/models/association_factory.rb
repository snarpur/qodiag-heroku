class AssociationFactory
  attr_reader :items
  def initialize(name, opt={})
    @items = {}
    case name
    when :client_as_parent_invitation
      KK.see "kalling association factory"
      @items[:caretaker] = opt[:current_user]
      @items[:parent] = opt[:user]
      @items[:child] = Person.new(:factory => {:name => :child, :relation => @items[:parent].build_person})
      @items[:child].inverse_relationships.build(:name => "patient", :person_id =>  @items[:caretaker].person.id)
    end
    @items
  end
end