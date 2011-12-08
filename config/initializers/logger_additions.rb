if Rails.env.development? 
  logger = ActiveRecord::Base.logger
  def logger.debug_variables(bind)
    vars = eval('local_variables + instance_variables', bind)
    vars.each do |var|
      debug  "#{var} = #{eval(var, bind).inspect}"
    end
  end

  class CustomOutput
    def see(msg)
      puts "<SEE>".foreground(:black).background(:green) + "  " + "#{msg}".foreground(:white).background(:blue)
    end
    def log(msg)
      ActiveRecord::Base.logger.debug "<LOG>".foreground(:yellow).background(:red) + "  " + "#{msg}".foreground(:white).background(:blue)
    end
  end

  KK = CustomOutput.new
end