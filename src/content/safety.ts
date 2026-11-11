export type SafetyStatus = "live" | "soon" | "partial";

export const safetySeed: Array<{
  id: string;
  sortOrder: number;
  status: SafetyStatus;
  titleEs: string;
  bodyEs: string;
  titleEn: string;
  bodyEn: string;
}> = [
  {
    id: "driver_review",
    sortOrder: 1,
    status: "partial",
    titleEs: "Revisión de preinscripciones",
    bodyEs:
      "El sitio ya recibe solicitudes de conductores y una persona del equipo puede revisarlas, cambiar su estado y pedir más información. La verificación de identidad dentro de la aplicación todavía no está operativa.",
    titleEn: "Pre-registration review",
    bodyEn:
      "The website already accepts driver applications, and a team member can review them, change their status, and ask for more information. In-app identity verification is not operating yet.",
  },
  {
    id: "documents",
    sortOrder: 2,
    status: "partial",
    titleEs: "Documentos en custodia privada",
    bodyEs:
      "Si adjuntas licencia, matrícula, seguro u otro archivo, se guarda fuera del sitio público. Solo entra el personal autorizado. Subir un archivo no significa que ya fue verificado.",
    titleEn: "Documents kept private",
    bodyEn:
      "If you attach a license, registration, insurance, or another file, it is stored outside the public website. Only authorized staff can open it. Uploading a file does not mean it has been verified.",
  },
  {
    id: "driver_verification",
    sortOrder: 3,
    status: "soon",
    titleEs: "Verificación de identidad del conductor",
    bodyEs:
      "La comprobación de identidad y de documentos dentro del flujo de la aplicación está prevista. Hoy no está activa y no debemos presentarla como si ya protegiera un viaje.",
    titleEn: "Driver identity verification",
    bodyEn:
      "Identity and document checks inside the app flow are planned. They are not active today and should not be described as if they already protect a trip.",
  },
  {
    id: "passenger_verification",
    sortOrder: 4,
    status: "soon",
    titleEs: "Verificación de la cuenta de pasajero",
    bodyEs:
      "La cuenta de pasajero y su verificación se crearán en la aplicación. Desde este sitio todavía no se abre esa cuenta.",
    titleEn: "Passenger account verification",
    bodyEn: "Passenger accounts and their verification will be created in the app. This website does not open that account yet.",
  },
  {
    id: "ratings",
    sortOrder: 5,
    status: "soon",
    titleEs: "Calificaciones",
    bodyEs:
      "Pasajeros y conductores podrán calificar la experiencia cuando la función esté en la app. El sitio no muestra calificaciones reales ni testimonios.",
    titleEn: "Ratings",
    bodyEn:
      "Riders and drivers will be able to rate the experience when the feature is in the app. This website does not show real ratings or testimonials.",
  },
  {
    id: "trip_history",
    sortOrder: 6,
    status: "soon",
    titleEs: "Historial de viajes",
    bodyEs: "El historial de viajes vivirá en la aplicación. Aquí no se puede consultar ni reservar un viaje.",
    titleEn: "Trip history",
    bodyEn: "Trip history will live in the app. You cannot look up or book a trip here.",
  },
  {
    id: "gps",
    sortOrder: 7,
    status: "soon",
    titleEs: "Seguimiento del viaje",
    bodyEs: "El seguimiento del recorrido en el mapa está previsto para la aplicación. No está disponible en este sitio.",
    titleEn: "Trip tracking",
    bodyEn: "Map tracking for a trip is planned for the app. It is not available on this website.",
  },
  {
    id: "share_trip",
    sortOrder: 8,
    status: "soon",
    titleEs: "Compartir el viaje",
    bodyEs: "Compartir el viaje con contactos de confianza está previsto para la aplicación y todavía no se puede usar.",
    titleEn: "Share your trip",
    bodyEn: "Sharing a trip with trusted contacts is planned for the app and cannot be used yet.",
  },
  {
    id: "emergency",
    sortOrder: 9,
    status: "soon",
    titleEs: "Asistencia de emergencia en la app",
    bodyEs:
      "Un acceso de emergencia dentro de la aplicación está en el plan y no existe todavía. En una emergencia real, contacta al 911 o al servicio local correspondiente. No esperes a una función que aún no está publicada.",
    titleEn: "In-app emergency assistance",
    bodyEn:
      "An emergency control inside the app is planned and does not exist yet. In a real emergency, contact 911 or the local service that applies. Do not wait on a feature that is not published.",
  },
  {
    id: "reporting",
    sortOrder: 10,
    status: "partial",
    titleEs: "Reportar un problema",
    bodyEs: "Ya puedes reportar por el formulario de Contacto o por Info@DameBolaApp.com.",
    titleEn: "Report a problem",
    bodyEn: "You can already report an issue through the Contact form or Info@DameBolaApp.com.",
  },
  {
    id: "support",
    sortOrder: 11,
    status: "live",
    titleEs: "Atención por el sitio",
    bodyEs:
      "El formulario de contacto guarda tu mensaje para el equipo. El correo de la empresa es Info@DameBolaApp.com. La respuesta automática depende de que el buzón del servidor esté configurado.",
    titleEn: "Support on the website",
    bodyEn:
      "The contact form stores your message for the team. The company email is Info@DameBolaApp.com. An automatic email reply depends on the server mailbox being configured.",
  },
  {
    id: "privacy",
    sortOrder: 12,
    status: "live",
    titleEs: "Privacidad y eliminación de datos",
    bodyEs:
      "La política de privacidad, el aviso de cookies y la página para solicitar la eliminación de datos están publicados.",
    titleEn: "Privacy and data deletion",
    bodyEn:
      "The privacy policy, the cookie notice, and the data-deletion request page are published.",
  },
];
