class Entity < ActiveRecord::Base
  attr_accessible :id, :created_at, :updated_at, :type, :source, :external_url,
                  :media_url, :caption, :displayability_rank, :interestingness,
                  :radius_rank, :radius_distance, :data

  belongs_to :query

end
