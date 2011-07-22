class Timeline
  attr_accessor :month_width,
                :line_height,
                :gutter_width,
                :header_height,
                :body_width,
                :history_width,
                :even_month_class,
                :months,
                :responder_items,
                :starts,
                :ends,
                :line_height_expanded,
                :chart_dialog_width


  def initialize(person)
    #YAML.load_file("#{RAILS_ROOT}/config/config.yml")
    @person = person
    month_padding = 6
    @starts = (@person.responder_items.order(:created_at).first.created_at).beginning_of_month - month_padding.months
    @ends = (Time.zone.now).beginning_of_month + month_padding.months
    @month_width = 70
    @line_height = 80
    @item_width = 5
    @line_height_expanded = 400
    @chart_dialog_width = 400
    @header_height = 35
    self
  end

  def months
    total_months = timeline_month_span
    months = [@starts]
    total_months.times do |i|
      months << @starts + i.months unless i.zero?
    end
    months
  end

  def diff_in_months(from,to)
    diff_years = diff_in_years(from,to)
    start_month = from.month
    end_month = to.month
    if start_month > end_month
      month_diff = (diff_years - 1) * 12 + ((12 - start_month) + end_month)
    else
      month_diff = diff_years * 12 + (end_month - start_month)
    end
    month_diff
  end

  def timeline_month_span
    diff_in_months(@starts,@ends)
  end

  def diff_in_days(from,to)
    (from - to).abs.to_int
  end

  def diff_in_years(from,to)
    to.year - from.year
  end

  def even_quarter?(month)
    (((month - 1) / 3) + 1).even?
  end

  def even_month_class(month)
    "even" if even_quarter?(month.month)
  end

  def day_width
    history_width.fdiv(diff_in_days).round(2)
  end

  def canvas_width
    (month_width * 12) + gutter_width
  end

  def history_view_width
    month_width * 12
  end

  def gutter_width
    month_width * 2
  end

  def history_width
     timeline_month_span * month_width
  end

  def item_style(date)
    css = {:left => horizontal_position(date),
           :top => line_height/3  }
    to_css css
  end

  def position_within_month(date)
      days = date.day * (month_width.fdiv( Time.days_in_month(date.month, date.year)).round(2))
  end

  def position_of_month(date)
    months = diff_in_months(@starts,date) * month_width
  end

  def horizontal_position(date)
    position_of_month(date) + position_within_month(date) - @item_width
  end


  def current_position
    canvas_width - history_width
  end

  def canvas_end_position
    -current_position + canvas_width
  end

  def item_name(name)
    I18n.t("surveys.#{name}")
  end

  def responder_item_codes
    @responder_items.map{|i| i.access_code}.uniq
  end


  def responder_items_with_position
     @responder_items.map do |i|
      attributes = {:position => horizontal_position(i.created_at),
                    :access_code => i.access_code,
                    :item_name => item_name(i.access_code)}
      i.attributes.merge(attributes)
    end
  end

  def dimensions
    values = {}
    %w{history_width gutter_width current_position canvas_end_position
       month_width line_height line_height_expanded chart_dialog_width canvas_width history_view_width}.
    each{|i| values[i.to_sym] = self.send(i)}
    values.merge!(:end_position => current_position)
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