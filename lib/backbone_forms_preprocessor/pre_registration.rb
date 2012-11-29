#TODO: Create registration form when respondent is guardian only
class BackboneFormsPreprocessor::PreRegistration < BackboneFormsPreprocessor::Base
  include ActiveAttr::Model

  attr_accessor :responder_item


  def responder_item
    @root_object
  end

  def responder_item_attributes
    @root_object.attributes
  end

  #FIXME: Delete - not called in edit.json.rabl
  def subject
    attributes = @root_object.subject.attributes
    attributes[:inverse_relationships] = @root_object.subject.inverse_relationships.map{|i| i.attributes}
    attributes
  end
  #FIXME: Delete - not called in edit.json.rabl
  def respondent
    @root_object.respondent.attributes
  end

 end