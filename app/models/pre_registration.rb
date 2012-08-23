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

  def populate_form(form_content,parent,destination={})
    form_content.each do |item, settings|
      relation_obj = get_parent_relation(parent, form_content[item])
      destination[item] = relation_obj.attributes
      destination[item][:schema] = settings[:schema]
      settings[:schema].each do |k,v| 
        if (v.respond_to?(:has_key?) && v.has_key?(:schema))
         populate_form({k.to_sym => v} ,relation_obj,destination[item])
        end
      end
    end
    destination
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
  def get_parent_relation(parent, form_content)
    #START: implement has_many
    if form_content[:as].is_a?(Array)
      KK.log "has_many Not implemented !"
    else
      relation = form_content[:as].nil? ? form_content[:model] : form_content[:as]
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

end