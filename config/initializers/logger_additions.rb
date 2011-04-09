logger = ActiveRecord::Base.logger
def logger.debug_variables(bind)
  vars = eval('local_variables + instance_variables', bind)
  vars.each do |var|
    debug  "#{var} = #{eval(var, bind).inspect}"
  end
end

class CustomOutput
  def see(msg)
    puts "=>".foreground(:black).background(:green) + "  " + "#{msg}".foreground(:white).background(:blue)
  end
end

KK = CustomOutput.new