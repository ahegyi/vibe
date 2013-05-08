class VibeController < ApplicationController

  include VibeHelper

  def index
    @images = {}


    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @images }
    end
  end

  def fs_trending

    # @client = Foursquare2::Client.new(:client_id => 'FUYVKTX2TB32OSSWQOE5LII32C35AGHEJUCTLMSBPV0RUGNV', :client_secret => 'MFPXAPUF1SCBVEBJKMYOBJPED0CLAN2XUSM1WXF5IVXOLTVR', :api_version => '20130505')

    ll = "34.048961,-118.238952"

    @foursquare_arr = foursquare_ll(ll)

    respond_to do |format|
      format.html # matt.html.erb
      format.json { render json: @foursquare_arr }
    end

  end

    def fs_top_photo

    @client = Foursquare2::Client.new(:client_id => "FUYVKTX2TB32OSSWQOE5LII32C35AGHEJUCTLMSBPV0RUGNV", :client_secret => 'MFPXAPUF1SCBVEBJKMYOBJPED0CLAN2XUSM1WXF5IVXOLTVR', :api_version => '20130505')

    ll = "34.048961,-118.238952"

    @trending_venues = @client.trending_venues(ll, {:limit => 2, :radius => 5000})

    @id = @trending_venues.venues[0]["id"]

    @trending_venue = @client.venue_photos(@id, {:limit => 2})

    @image = @trending_venue["items"][0]
    @image_url = @image['prefix'] + "540x710" + @image['suffix']

    respond_to do |format|
      format.html # matt.html.erb
      format.json { render json: @image}
    end

  end

end
