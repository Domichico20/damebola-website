UPDATE "SafetyFeature"
SET
  "bodyEs" = 'El formulario de contacto guarda tu mensaje para el equipo. El correo de la empresa es Info@DameBolaApp.com.',
  "bodyEn" = 'The contact form stores your message for the team. The company email is Info@DameBolaApp.com.',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'support';
