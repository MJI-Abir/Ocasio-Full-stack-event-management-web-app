-- Add isAdmin column to users table if it doesn't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Set user with id=8 as admin
UPDATE users
SET is_admin = true
WHERE id = 8;