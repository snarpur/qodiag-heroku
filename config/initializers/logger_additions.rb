if Rails.env.development? || Rails.env.test?
  logger = ActiveRecord::Base.logger
  def logger.debug_variables(bind)
    vars = eval('local_variables + instance_variables', bind)
    vars.each do |var|
      debug  "#{var} = #{eval(var, bind).inspect}"
    end
  end

  class CustomOutput
    COLORS = {
      :r => [:red,[255,255,255]],
      :b => [:blue,:yellow],
      :g => [:green,[0,0,0]],
      :y => [:yellow,[0,0,0]]
    }
    def time
      "#{Time.now.strftime('%H:%M:%S')}".foreground(:black).background(:white)
    end

    def log_type(log)
      "<#{log}>".foreground(:yellow).background(:red)
    end
    
    def log_msg(msg,color=nil)
      if color.nil?
         " :::: " + "#{msg}".foreground(:black).background(:yellow)
      else
        " :::: " + "#{msg}".foreground(COLORS[color][1]).background(COLORS[color][0])
      end
    end

    def see(msg,color)
      puts "<SEE>".foreground(:black).background(:green) + "  " + "#{msg}".foreground(:white).background(:blue)
    end
    
    def log(msg,color=nil)
      # ActiveRecord::Base.logger.debug "<LOG>".foreground(:yellow).background(:red) + "  " + "#{msg}".foreground(:white).background(:blue)
      Rails.logger.debug log_type("LOG") + "  " + time()
      Rails.logger.debug log_type("LOG") + "  " + log_msg(msg,color)
    end

    def ap(msg)
      Rails.logger.ap
    end
  end

  KK = CustomOutput.new


  class LogMethodCaller
    def caller_method_name
        parse_caller(caller(2).first).last
    end

    def parse_caller(at)
        if /^(.+?):(\d+)(?::in `(.*)')?/ =~ at
            file = Regexp.last_match[1]
        line = Regexp.last_match[2].to_i
        method = Regexp.last_match[3]
        [file, line, method]
      end
    end
  end

  LM = LogMethodCaller.new 
end

