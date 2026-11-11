UPDATE "SiteSetting"
SET value = 'DAMEBOLA LLC', "updatedAt" = CURRENT_TIMESTAMP
WHERE key = 'legalName' AND value IN ('DameBola', 'DameBola LLC', '');
