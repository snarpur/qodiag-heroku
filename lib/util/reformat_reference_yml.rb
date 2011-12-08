module ReformatReferenceYml
  def ReformatReferenceYml.reformat_file(name)
    out = []
    @yml = YAML::load(File.open("#{Rails.root}/db/survey_data_references/#{name}/norm_orginal.yml"))
    @yml['norm_references'].each do |norm_data|
      group_results =  ['average', 'standard_deviation']
      group_names = ['inattention', 'impulsivity_hyperactivity', 'total']
        ref = {"group" => norm_data['group'], "scores" => []}
        norm_data['scores'].each_with_index do |item, index|
         ref["scores"] << {group_names[index] => item.enum_for(:each_with_index).collect {|it,ind| [group_results[ind], it]}}
      end
      out << ref


    end
    f = File.new("#{Rails.root}/db/survey_data_references/#{name}/norm_formatted.yml", "r+")
    YAML::dump(out, f)
    f.close
  end
end
