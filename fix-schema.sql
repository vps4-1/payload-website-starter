-- Add API key fields to users table if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS enable_a_p_i_key boolean,
ADD COLUMN IF NOT EXISTS api_key varchar,
ADD COLUMN IF NOT EXISTS api_key_index varchar;