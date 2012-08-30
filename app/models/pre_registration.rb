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
      if field_is_nested?(settings) && !field_is_list?(settings)
        relation_obj = get_parent_relation(parent,item,settings)
        content[item] = relation_obj.attributes
        content[item] = content[item].merge(populate_nested_entry(settings[:schema],relation_obj))
      end
      if field_is_list?(settings) #field_is_list?(settings)
        content[item.to_sym] = settings[:objects].map do |i|
        relation_obj = get_parent_relation(parent,item,i)   
        relation_obj.attributes
        end
          # content = {item.to_sym => get_relation_attributes(settings)}
      
      end
    end
    content
  end
  
  #REFACTOR: Clarify initention for improved readability
  def set_model_str(form_content)
    schema = {}
    form_content.each do |item,settings|
      if field_is_nested?(settings)
        schema[item] = settings.merge({:modelStr => settings[:model]})
        KK.log schema[item]
        schema[item][:schema] = schema[item][:schema].merge(set_model_str(schema[item][:schema]))
        schema[item] = schema[item].except(:objects,:as)
      end
      if settings.is_a?(Array)
        schema[item] = settings.map{|i| set_model_str({item.to_sym => i})[item.to_sym]}
      end
    end
    schema
  end
  
  def responder_item_attributes
    @responder_item.attributes
  end

  def step_names
    @step_names = @steps.map{|n| n[:name] }
  end

  def current_step_name
    @steps[@current_step_no - 1][:name]
  end
    

  def current_step_form_schema
   set_model_str @steps[current_step_no - 1][:form_content]
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
      KK.log "has_many Not implemented !"
    else
      relation = form_content[:as].nil? ? form_obj : form_content[:as]
      if !(relation =~/\./).nil?
        relation.split(".").inject(self) do |memo,value|
          obj = memo.send(value)
          memo = obj
        end
      else
        relation_obj = parent.send(relation)
        relation_obj ||= parent.association(relation).build
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
  
  def field_is_nested?(field)
    (field.respond_to?(:has_key?) && (field[:type] == "NestedModel" || field[:itemType] == "NestedModel" ))
  end

  def field_is_list?(field)
    (field.respond_to?(:has_key?) && field.has_key?(:objects))
  end

end