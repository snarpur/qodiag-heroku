def build_attributes(*args)
  FactoryGirl.build(*args).attributes.delete_if do |k, v| 
    ["id", "created_at", "updated_at"].member?(k)
  end
end

def params_for(factory_name)
  exclude_params = [ "id", "created_at", "updated_at" ]
  f = FactoryGirl.build(factory_name)

  params = f.attributes.except(*exclude_params).dup

  f.reflections.select { |k,v|
    v.macro == :has_many && !v.instance_of?(ActiveRecord::Reflection::ThroughReflection)
  }.each_key do |k|
    assoc_collection = f.send(k)

    unless assoc_collection.empty?
      params["#{k.to_s}_attributes"] = {}

      assoc_collection.each_with_index do |assoc_obj,idx|
        params["#{k.to_s}_attributes"][idx.to_s] = assoc_obj.attributes.except(*exclude_params << "#{f.class.name.underscore}_id")
      end
    end
  end

  params
end