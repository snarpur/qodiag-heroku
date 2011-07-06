class Timeline
  attr_accessor(:month_width, :line_height)
  def initialize(person)
    @person = person
    @starts = @person.responder_items.order(:created_at).first.created_at - 1.month
    @ends = Time.now + 1.month
    @month_width = 30
    @line_height = 80
  end

  def months
    total_months = time_diff = diff_in_months
    months = [@starts]
    total_months.times do |i|
      months << @starts + i.months unless i.zero?
    end
    months
  end

  def diff_in_months
    time_diff = Time.diff(@starts, @ends)
    total_months = time_diff[:year] * 12 + time_diff[:month]
  end

  def diff_in_days
    (@ends.to_date - @starts.to_date).days
  end

  def day_width
    body_width / diff_in_days
  end

  def body_width
    (diff_in_months + 1 ) * @month_width
  end

  def gutter_width
    month_width * 2
  end
  def gutter_style
    css = {:width => gutter_width }
    to_css css
  end

  def gutter_item_style
    css = {:line_height => line_height,
           :height => line_height }
    to_css css
  end

  def month_style
    style = "width: #{body_width}px;"
    style << "padding-left: #{month_width*2}px;"
    {:style => style}
  end
  def line_style
    css = {:height => line_height}
    to_css css
  end

  def history_style
    css = {:width => body_width - gutter_width,
           :left => gutter_width  }
    to_css css
  end

  def item_style(date)
    {:style => "left:#{horizontal_position(date)}px;"}
  end


  def set_style(element)
    {:style => "width:#{self.send(element)}px;"}
  end

  def horizontal_position(date)
    (date - @starts) * day_width
  end

  private
  def to_css(rules)
    css = ""
    rules.each do |k,v|
      css << "#{k.to_s.gsub(/\_/,"-")}:#{v}px;"
    end
    {:style => css}
  end


end
