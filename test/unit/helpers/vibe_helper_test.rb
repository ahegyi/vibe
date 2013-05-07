require 'test_helper'

class VibeHelperTest < ActionView::TestCase

  test "san francisco is san francisco" do
    point = get_point("san francisco")

    assert_equal [37.77896, -122.4192], point
  end

  test "incomprehensible text is an empty array" do
    point = get_point("skdfjhsldkjfhsdkjf")

    assert_equal [], point
  end

end
