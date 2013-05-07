class ApplicationController < ActionController::Base
  protect_from_forgery

  def fs_client
    return Foursquare2::Client.new(:client_id => ENV['UYVKTX2TB32OSSWQOE5LII32C35AGHEJUCTLMSBPV0RUGNV'], :client_secret => ENV['UYVKTX2TB32OSSWQOE5LII32C35AGHEJUCTLMSBPV0RUGNV'])
  end

end
