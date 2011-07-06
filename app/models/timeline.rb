class Timeline
  attr_accessor(:month_width, :line_height)
  def initialize(person)
    @person = person
    @starts = @person.responder_items.order(:created_at).first.created_at - 1.month
    @ends = Time.now + 1.month
    @month_width = 70
    @line_height = 80
    @header_height = 35
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
  def even_quarter?(month)
    (((month - 1) / 3) + 1).even?
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

  def menu_style
    css = {:height => @header_height}
    to_css css
  end

  def month_style
    css= {:width => body_width,
          :bottom => 0}
    to_css css
  end

  def month_cell_style(month,order)
    css = {:width => @month_width,
           :left => order * @month_width}
    css.merge!(:selector => 'even') if even_quarter?(month)
    to_css css
  end

  def line_style
    css = {:height => line_height}
    to_css css
  end

  def history_style
    css = {:width => body_width - gutter_width,
           :left => gutter_width,
           :padding_top =>  @header_height}
    to_css css
  end

  def item_style(date)
    css = {:left => horizontal_position(date),
           :top => line_height/3  }
    to_css css
  end


  def set_style(element)
    {:style => "width:#{self.send(element)}px;"}
  end

  def horizontal_position(date)
    (date - @starts) * day_width
  end

  private
  def to_css(rules)
    css,selector = ""
    rules.each do |k,v|
      KK.see k
      if k.eql?(:selector)
        selector = v
      else
        css << "#{k.to_s.gsub(/\_/,"-")}:#{v}px;"
      end
    end
    css = {:style => css}
    css.merge!(:class => selector) unless selector.blank?
    css
  end


end
