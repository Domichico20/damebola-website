UPDATE "SiteSetting"
SET value = 'DameBola LLC', "updatedAt" = CURRENT_TIMESTAMP
WHERE key = 'legalName' AND value IN ('DameBola', '');

UPDATE "SafetyFeature"
SET
  "bodyEs" = 'El formulario de contacto guarda tu mensaje para el equipo. El correo de la empresa es Info@DameBolaApp.com. La respuesta automática depende de que el buzón del servidor esté configurado.',
  "bodyEn" = 'The contact form stores your message for the team. The company email is Info@DameBolaApp.com. An automatic email reply depends on the server mailbox being configured.',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'support';

UPDATE "SafetyFeature"
SET
  "bodyEs" = 'La política de privacidad, el aviso de cookies y la página para solicitar la eliminación de datos están publicados.',
  "bodyEn" = 'The privacy policy, the cookie notice, and the data-deletion request page are published.',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE id = 'privacy';

UPDATE "HelpArticle"
SET
  body = 'DameBola no va a marcar una función de seguridad como disponible si no está implementada y verificada.

Hoy el sitio sí recibe preinscripciones, guarda los documentos fuera del área pública, ofrece un formulario de contacto y publica la política de privacidad, los términos y la página para eliminar datos. También puedes pedir la eliminación de tus datos.

El seguimiento GPS, compartir el viaje, el botón de emergencia dentro de la app, las calificaciones en el viaje y la verificación de identidad dentro de la aplicación están en preparación. En la página de Seguridad siguen como Próximamente o Disponible en parte hasta que existan de verdad.

Si tienes una emergencia real, contacta a los servicios locales. En República Dominicana el número general de emergencias es 911. No dependas de la aplicación para eso mientras la función no esté publicada.

Este sitio no promete un seguro ni una garantía de seguridad. Cada conductor sigue siendo responsable de los permisos y el seguro que exija la ley. Los requisitos definitivos se publicarán antes de activar conductores.',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE locale = 'es' AND slug = 'seguridad-lo-que-esta-y-lo-que-viene';

UPDATE "HelpArticle"
SET
  body = 'DameBola will not mark a safety feature as available unless it is built and verified.

Today the website accepts driver pre-registrations, stores documents outside the public site, offers a contact form, and publishes the privacy policy, the terms, and the data-deletion page. You can also request deletion of your data.

GPS trip tracking, trip sharing, an in-app emergency button, in-trip ratings, and in-app identity verification are still in preparation. On the Safety page they stay marked Coming soon or Partly available until they actually exist.

In a real emergency, contact local emergency services. In the Dominican Republic the general emergency number is 911. Do not rely on the app for that until the feature is published.

This website does not promise insurance or a safety guarantee. Drivers remain responsible for the permits and insurance the law requires. Final requirements will be published before drivers are activated.',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE locale = 'en' AND slug = 'seguridad-lo-que-esta-y-lo-que-viene';
