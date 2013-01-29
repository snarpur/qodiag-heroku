module BackboneFormsPreprocessor
  class Base
    include ActiveAttr::Model
    attr_accessor :root_object, :steps,:form_identifier
    attr_reader :complete, :redirect_url_on_complete, :root_url

    def initialize(params)
      @form_identifier = params[:form_template]
      @current_step_no = params[:step_no].nil? ? 1 : params[:step_no].to_i
      @root_object = get_root_object(@current_step_no,params)
    end

    def steps
      @steps ||= form_template['steps']
    end

    def get_root_object(step_no,params)
      if params[:root_object] && params[:form_content].nil?
        params[:root_object]
      else
        get_class_or_decorator(form_root_name(step_no)).send('find_or_initialize_by_id',params[:form_content][form_root_name(step_no)])
      end
    end

    def form_template
      @form_template ||= Marshal::load(Marshal.dump(ApplicationForms.get(@form_identifier)))
    end
    
    #REFACTOR: Clarify initention for improved readability
    def populate_form(form_content,parent=nil)
      content = {}
      form_content.each do |item, settings|
        if parent.nil?
          relation_obj = @root_object
        else 
          relation_obj = get_parent_relation(parent,item,form_content[item])
        end
        content[item] = schema_attributes(relation_obj,settings[:schema])
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
                obj_attrs = schema_attributes(i,settings[:schema].at(index))
                obj_attrs[:schema] = settings[:schema].at(index) 
                obj_attrs.merge(populate_nested_entry(settings[:schema].at(index),i))
              else
                obj_attrs = schema_attributes(i,settings[:schema])
                obj_attrs.merge(populate_nested_entry(settings[:schema],i))
              end
            end
          else
            content[item] = schema_attributes(relation_obj,settings[:schema])
            content[item] = content[item].merge(populate_nested_entry(settings[:schema],relation_obj))
          end
        end
      end
      content
    end

    def root_object_id
      @root_object.id
    end

    def root_url
      @form_template[:root_url]
    end
    
    def responder_item_attributes
      @root_object.attributes
    end

    def step_names
      @step_names = steps.map{|n| n[:name]}
    end

    def number_of_steps
      steps.length 
    end
    
    def current_step_no
      @current_step_no ||= steps.index(@current_step)+1
    end

    def next_step_no
      steps.index(current_step)+2
    end

    def previous_step_no
      steps.index(current_step)
    end

    def first_step?
      current_step_no == steps.first
    end

    def last_step?
      current_step_no == last_step_no
    end

    def last_step_no
      steps.size
    end

    def next_is_last?
      next_step_no == steps.size
    end

    def step_forward
      @current_step = steps[next_step_no]
    end

    def step_name(step_no)
      steps[step_no-1][:name]
    end

    def step_form_schema(step_no)
      steps[step_no-1][:form_content]
    end
    
    def step_form_content(step_no)
      populate_form(step_form_schema(step_no)) 
    end
    
    def form_root_name(step_no)
      step_form_schema(step_no).keys.first
    end

    def form_root_class(step_no)
      form_root_name(step_no).classify
    end

    def current_step
      @current_step || steps.first
    end

    def current_step_name
      step_name(@current_step_no)
    end

    def current_step_form_schema
      step_form_schema(@current_step_no)
    end

    def current_step_form_content
      populate_form(current_step_form_schema) 
    end
    
    def current_form_root_name
      current_step_form_schema.keys.first
    end

    def current_form_root_class
      current_form_root_name.classify
    end

    def decorator_for_class(class_name)
      class_name =  class_name.name if class_name.is_a?(Class)
      "#{class_name}_decorator".classify
    end
    
    def has_decorator?(class_name)
      klass = Module.const_get(decorator_for_class(class_name))
      return klass.is_a?(Class)
    rescue NameError
      return false
    end
      
    def get_class_or_decorator(class_name)
      has_decorator?(class_name) ? Module.const_get(decorator_for_class(class_name)) : Module.const_get(class_name.classify)
    end

    def decorate(obj)
      if has_decorator?(obj.class.name)
        Module.const_get(decorator_for_class(obj.class.name)).decorate(obj)
      else
        obj
      end
    end

    def save_step(attributes)
      if update_attributes(attributes)
        if last_step? && respond_to?(:complete_callback)
          complete_callback
        end
      end   
    end
    def update_attributes(attributes)
      attrs = attributes.values.first
      @root_object.update_attributes(attrs.with_indifferent_access)
    end

    def validate
      @root_object.valid?
    end

    def errors
      @root_object.errors.messages
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
      decorate(relation_obj)
    end

    def schema_attributes_keys(schema)
      schema.select{|k,v| k unless type_is_nested_model?(v)}.keys
    end

    def schema_attributes(obj,schema)
      attributes = {}
      schema_attributes_keys(schema).each do |i|
        attributes[i] = obj.send(i)
      end
      attributes.merge(set_object_class_string(obj))
    end

    def set_object_class_string(obj)
      klass = if obj.respond_to?(:model)
        obj.model.class.name
      else
        obj.class.name
      end
      {:object_class => klass.underscore}
    end

    def type_is_nested_model?(field)
      return if field.is_a?(String) || field[:type].nil?
      (field.respond_to?(:has_key?) && (field[:type] == "NestedModel" || field[:type].include?("NestedCollection")))
    end

    def is_accociation?(parent,item)
      (!parent.class.reflect_on_association(item.to_sym).nil?)
    end

  end
end
