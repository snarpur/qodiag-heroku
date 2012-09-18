class PreRegistration
  include ActiveAttr::Model

attr_accessor :responder_item, :steps

  def initialize(params)
    @responder_item = ResponderItem.find(params[:responder_item_id])
    @stepts = steps
    @current_step_no = params[:step_no].to_i
  end
  

  def steps
    @steps ||= Marshal::load(Marshal.dump(ApplicationForms.get(@responder_item.registration_identifier)['steps']))
  end

  
  def get_content_for_step(step)
    populate_form(step,@responder_item)
  end

  #REFACTOR: Clarify initention for improved readability
  def populate_form(form_content,parent)
    form_content = Hash[*form_content.to_a.flatten]
    content = {}
    form_content.each do |item, settings|
      relation_obj = get_parent_relation(parent,item,form_content[item])
      content[item] = relation_obj.attributes
      content[item] = content[item].merge(populate_nested_entry(settings[:schema],relation_obj))
    end
    content
  end

  #REFACTOR: Clarify initention for improved readability
  def populate_nested_entry(form_content,parent)
    content = {}
    form_content.each do |item,settings|
      if type_is_nested_model?(settings) || is_accociation?(parent,item)
        relation_obj = get_parent_relation(parent,item,settings)
        if relation_obj.is_a?(Array)
          content[item] = relation_obj.map do |i|
            if settings[:schema].is_a?(Array)
              index = relation_obj.index(i)
              i.attributes.merge(populate_nested_entry(settings[:schema].at(index),i))
            else
              i.attributes.merge(populate_nested_entry(settings[:schema],i))
            end
          end
        else
          content[item] = relation_obj.attributes
          content[item] = content[item].merge(populate_nested_entry(settings[:schema],relation_obj))
        end
        
      end
    end
    content
  end

  
  def responder_item_attributes
    @responder_item.attributes

  end

  def subject
    attributes = @responder_item.subject.attributes
    attributes[:inverse_relationships] = @responder_item.subject.inverse_relationships.map{|i| i.attributes}
    attributes
  end

  def respondent
    @responder_item.respondent.attributes
  end

  def step_names
    @step_names = @steps.map{|n| n[:name] }
  end

  def current_step_name
    @steps[@current_step_no - 1][:name]
  end
    

  def current_step_form_schema
    @steps[current_step_no - 1][:form_content]
  end
  
  def current_step_form_content
    get_content_for_step @steps[current_step_no - 1][:form_content]
  end

  def current_step
    @current_step || @steps.first
  end

  
  def step(step_no)
    self.current_step = @steps[step_no - 1]
  end
  
  def next_step
    @steps[@steps.index(current_step)+2]
  end

  def previous_step
    @steps[@steps.index(current_step)-1]
  end
  
  def current_step_no
    @current_step_no ||= @steps.index(current_step)+1
  end
  
  def next_step_no
    @steps.index(current_step)+2
  end

  def previous_step_no
    @steps.index(current_step)
  end

  def first_step?
    current_step == @steps.first
  end

  def last_step?
    current_step == @steps.last
  end
  
  def next_is_last?
    next_step_no == @steps.size
  end
  
  def update_attributes(attributes)
    attributes.each do |i|
      i.each do |k,v|
          rootObject =  eval(k.to_s.classify).find(v.with_indifferent_access[:id])
          rootObject.update_attributes(v)
      end
    end
  end
  
  private
  def get_parent_relation(parent, form_obj, form_content)
    if form_content[:as].is_a?(Array)
      relation_obj = form_content[:as].map do |i|
        fc = form_content.merge({:as => i})
        get_parent_relation(parent, form_obj, fc)
      end
      relation_obj
    else
      relation = form_content[:as].nil? ? form_obj : form_content[:as]
      if !(relation =~/\./).nil?
        relation_obj = relation.split(".").inject(self) do |memo,value|
          obj = memo.send(value)
          memo = obj
        end
        relation_obj
      else
        relation_obj = parent.send(relation)
        relation_obj ||= parent.association(relation).build
        if relation_obj.nil? || (relation_obj.is_a?(Array) && relation_obj.empty?)
          association = parent.class.reflect_on_association(relation.to_sym)
          relation_obj = parent.send(association.table_name).build(association.conditions).first
        end
        relation_obj
      end
    end

  end

  def get_relation_attributes(obj)
    if obj.is_a?(Array)
      obj.map{|i| i.attributes}
    else
      obj.attributes
    end
  end
  
  def type_is_nested_model?(field)
    return if field.is_a?(String) || field[:type].nil?
    (field.respond_to?(:has_key?) && (field[:type] == "NestedModel" || field[:type].include?("NestedCollection")))

  end

  def is_accociation?(parent,item)
    (!parent.class.reflect_on_association(item.to_sym).nil?)
  end

  def field_is_list?(field)
    (field.respond_to?(:has_key?) && field.has_key?(:objects))
  end

end