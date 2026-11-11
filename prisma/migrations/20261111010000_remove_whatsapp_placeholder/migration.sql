UPDATE "FaqItem"
SET
  answer = 'Puedes escribir por el formulario de Contacto o al correo Info@DameBolaApp.com.',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE answer LIKE '%cuando esté confirmado%';

UPDATE "FaqItem"
SET
  answer = 'Use the Contact form or email Info@DameBolaApp.com.',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE answer LIKE '%when it has been confirmed%';
