-- Fix designations foreign key constraint violation
-- Step 1: Set invalid settingId to NULL
UPDATE designations 
SET "settingId" = NULL 
WHERE "settingId" NOT IN (SELECT id FROM settings);

-- Step 2: Drop the existing foreign key constraint if it exists
ALTER TABLE designations 
DROP CONSTRAINT IF EXISTS "FK_3e0d7eaaa5b74aeafb2a6be74b0";

-- Step 3: Recreate the foreign key constraint
ALTER TABLE designations 
ADD CONSTRAINT "FK_3e0d7eaaa5b74aeafb2a6be74b0" 
FOREIGN KEY ("settingId") 
REFERENCES settings(id) 
ON DELETE NO ACTION 
ON UPDATE NO ACTION;
