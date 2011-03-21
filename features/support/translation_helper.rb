module TranslationHelper
  
  MESSAGES = {
     :registration =>  {:translation => "devise.registrations"},
     :too_short => {:translation => "activerecord.errors.messages", :validator =>"Length", :condition => :minimum}
     }
  
   def get_error_translation(message,model,attribute)
      translation = MESSAGES[message.to_sym]
      if translation.nil?
          I18n.t("activerecord.errors.messages.#{message}")
      else
         all_validators = eval(model.capitalize).validators_on(attribute)
         target_validator = eval "ActiveModel::Validations::#{translation[:validator]}Validator"
         validator = all_validators.select{|o| o.kind_of?(target_validator) && o.options.has_key?(translation[:condition])}.first
         I18n.t("activerecord.errors.messages.#{message}", :count => validator.options[translation[:condition]])
      end
   end
   
   def get_message_translation(message,i18n_name)
     I18n.t("#{MESSAGES[i18n_name.to_sym][:translation]}.#{message}")
   end
end

module FactoryGirlStepHelpers
  def convert_association_string_to_instance(factory_name, assignment)
    attribute, value = assignment.split(':', 2)
    return if value.blank?
    attributes = convert_human_hash_to_attribute_hash(attribute => value.strip)
    factory = Factory.factory_by_name(factory_name)
    model_class = factory.build_class
    model_class.find(:first, :conditions => attributes) or
      Factory(factory_name, attributes)
  end

  def convert_human_hash_to_attribute_hash(human_hash, associations = [])
    human_hash.inject({}) do |attribute_hash, (human_key, value)|
      key = human_key.downcase.gsub(' ', '_').to_sym
      if association = associations.detect {|association| association.name == key }
        value = convert_association_string_to_instance(association.factory, value)
      end
      attribute_hash.merge(key => value)
    end
  end
  
  def process_attributes(factory, human_hash)
    attributes = convert_human_hash_to_attribute_hash(human_hash, factory.associations)
    factory_name = factory.human_name
    attributes.each_key do |o|
      attribute = o.to_s 
      if attribute.starts_with?("#{factory_name}_") or attribute.ends_with?("_#{factory_name}")
        association_name = association_name(factory_name, attribute)
        association_factory = association_factory(association_name.singularize)
        if !association_factory.nil? 
          association_object = convert_association_string_to_instance(association_factory,attributes[o])
        end
        attributes.delete(o)
        attributes.merge!(association_argument(association_name,association_object))
      end
    end
    attributes
  end
  
  def association_name(factory_name, association_string)
    regexp = Regexp.new("_?#{factory_name}_?")
    factory = association_string.gsub(regexp,"")
  end
  
  def association_factory(factory_name)
    if !Factory.factories[factory_name.to_sym].nil?
      factory_name
    else
      nil
    end
  end
  
  def association_argument(name,association_object)
    if name.pluralize.eql?(name)
      {name.to_sym => [association_object]}
    else
      {name.to_sym => association_object}
    end
  end
  
end

World(TranslationHelper,FactoryGirlStepHelpers)

Factory.factories.values.each do |factory|
  Given /^the following (?:#{factory.human_name}|#{factory.human_name.pluralize}) exists?:$/ do |table|
    table.hashes.each do |human_hash|
      attributes = process_attributes(factory, human_hash)
      Factory.create(factory.factory_name, attributes)
    end
  end

  Given /^an? #{factory.human_name} exists$/ do
    Factory(factory.factory_name)
  end

  Given /^(\d+) #{factory.human_name.pluralize} exist$/ do |count|
    count.to_i.times { Factory(factory.factory_name) }
  end

  if factory.build_class.respond_to?(:columns)
    factory.build_class.columns.each do |column|
      human_column_name = column.name.downcase.gsub('_', ' ')
      Given /^an? #{factory.human_name} exists with an? #{human_column_name} of "([^"]*)"$/i do |value|
        Factory(factory.factory_name, column.name => value)
      end

      Given /^(\d+) #{factory.human_name.pluralize} exist with an? #{human_column_name} of "([^"]*)"$/i do |count, value|
        count.to_i.times { Factory(factory.factory_name, column.name => value) }
      end
    end
  end
end


