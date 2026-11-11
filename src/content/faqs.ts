export type FaqSeed = {
  locale: "es" | "en";
  audience: "passenger" | "driver";
  sortOrder: number;
  question: string;
  answer: string;
};

export const faqSeed: FaqSeed[] = [
  {
    locale: "es",
    audience: "passenger",
    sortOrder: 1,
    question: "¿Qué es DameBola?",
    answer:
      "DameBola es una plataforma de transporte pensada para República Dominicana. La persona que viaja propone cuánto quiere pagar y la persona que conduce puede aceptar esa oferta o negociar otra tarifa. El sitio web explica el servicio, recibe preinscripciones y mensajes. Los viajes se solicitarán en la aplicación móvil, que todavía no está publicada.",
  },
  {
    locale: "es",
    audience: "passenger",
    sortOrder: 2,
    question: "¿Cómo funciona DameBola?",
    answer:
      "Cuando la aplicación esté disponible, el recorrido será: crear una cuenta, indicar el punto de recogida y el destino, proponer una tarifa, revisar las respuestas de conductores cercanos y elegir una opción. Hoy puedes conocer el proceso en Cómo funciona y dejar tu correo para el aviso de lanzamiento.",
  },
  {
    locale: "es",
    audience: "passenger",
    sortOrder: 3,
    question: "¿Cómo creo una cuenta?",
    answer:
      "La cuenta de pasajero se creará en la aplicación móvil. Esa aplicación todavía no está en App Store ni en Google Play, así que desde el sitio no se puede abrir una cuenta de viajes. Puedes registrarte en la lista de lanzamiento para recibir el aviso.",
  },
  {
    locale: "es",
    audience: "passenger",
    sortOrder: 4,
    question: "¿Cómo propongo una tarifa?",
    answer:
      "En la aplicación podrás escribir el monto que quieres pagar por ese viaje. El ejemplo de RD$250 y RD$300 que aparece en el sitio es solo una ilustración. No es una cotización ni una tarifa mínima.",
  },
  {
    locale: "es",
    audience: "passenger",
    sortOrder: 5,
    question: "¿Los conductores pueden hacer una contrapropuesta?",
    answer:
      "Sí. Un conductor podrá aceptar tu precio o enviar otra cifra. Tú podrás aceptar, rechazar o revisar otra oferta. Nadie está obligado a aceptar un precio.",
  },
  {
    locale: "es",
    audience: "passenger",
    sortOrder: 6,
    question: "¿Cómo elijo un conductor?",
    answer:
      "Antes de confirmar, la aplicación está prevista para mostrar la oferta y la información del conductor que la plataforma tenga disponible. Esa pantalla todavía no está activa. En el sitio solo verás ejemplos ilustrados, no conductores reales.",
  },
  {
    locale: "es",
    audience: "passenger",
    sortOrder: 7,
    question: "¿Cómo cancelo un viaje?",
    answer:
      "Todavía no hay una política de cancelación publicada porque los viajes en la aplicación no están activos. Cuando exista, se mostrará en la app y en la página de tarifas antes de que aplique. Hoy no hay una penalidad publicada en este sitio.",
  },
  {
    locale: "es",
    audience: "passenger",
    sortOrder: 8,
    question: "¿Cómo reporto un problema?",
    answer:
      "Usa la página de Contacto y elige Reportar un problema, o escribe a Info@DameBolaApp.com. El reporte dentro de la aplicación móvil está marcado como Próximamente hasta que esa función exista.",
  },
  {
    locale: "es",
    audience: "passenger",
    sortOrder: 9,
    question: "¿Cómo contacto a soporte?",
    answer:
      "Puedes escribir por el formulario de Contacto o al correo Info@DameBolaApp.com.",
  },
  {
    locale: "es",
    audience: "driver",
    sortOrder: 1,
    question: "¿Cómo puedo ser conductor?",
    answer:
      "Completa la preinscripción en Conduce con DameBola. El equipo revisará tu información y podrá pedirte más datos. Enviar el formulario no te aprueba automáticamente ni te permite recibir viajes hoy.",
  },
  {
    locale: "es",
    audience: "driver",
    sortOrder: 2,
    question: "¿Qué documentos se necesitan?",
    answer:
      "La lista definitiva de requisitos la publica DameBola en el formulario y puede cambiarla un administrador. El formulario ya puede recibir, de forma privada, la licencia, la matrícula, el seguro u otro documento. Guardarlos no significa que ya fueron verificados.",
  },
  {
    locale: "es",
    audience: "driver",
    sortOrder: 3,
    question: "¿Puedo registrar una motocicleta?",
    answer:
      "Sí. La preinscripción permite carro o motocicleta. Aceptar el registro depende de la revisión y de los requisitos que estén publicados en ese momento.",
  },
  {
    locale: "es",
    audience: "driver",
    sortOrder: 4,
    question: "¿Cómo se revisan las solicitudes?",
    answer:
      "Una persona del equipo cambia el estado entre Pendiente, En revisión, Aprobada, Rechazada o Se requiere más información. No hay aprobación automática. Aprobada, en esta etapa, no enciende una cuenta de conductor en la app.",
  },
  {
    locale: "es",
    audience: "driver",
    sortOrder: 5,
    question: "¿Cómo funciona la negociación del precio?",
    answer:
      "La persona pasajera propone una tarifa. Tú puedes aceptarla o enviar una contrapropuesta. El acuerdo queda entre las dos partes. El sitio no publica comisiones ni tarifas mínimas.",
  },
  {
    locale: "es",
    audience: "driver",
    sortOrder: 6,
    question: "¿Cómo recibo solicitudes de viaje?",
    answer:
      "Las solicitudes llegarán a la aplicación de conductores cuando esa aplicación esté publicada y tu cuenta esté activa. Hoy esa función está marcada como Próximamente. La preinscripción en la web no envía viajes.",
  },
  {
    locale: "es",
    audience: "driver",
    sortOrder: 7,
    question: "¿Cómo se calculan las ganancias?",
    answer:
      "Dependerán de los viajes que aceptes y de los precios que acuerdes. DameBola no promete un ingreso mínimo ni garantizado. Cualquier comisión futura se publicará antes de aplicarse. En este sitio no hay una comisión anunciada.",
  },
  {
    locale: "es",
    audience: "driver",
    sortOrder: 8,
    question: "¿Cómo contacto a soporte?",
    answer:
      "En Contacto elige Soporte para conductores o Preinscripción de conductores, o escribe a Info@DameBolaApp.com. Ten a mano la referencia de tu solicitud si ya enviaste el formulario.",
  },
  {
    locale: "en",
    audience: "passenger",
    sortOrder: 1,
    question: "What is DameBola?",
    answer:
      "DameBola is a transportation platform built for the Dominican Republic. Riders propose what they want to pay, and drivers can accept that offer or negotiate a different fare. This website explains the service and collects pre-registrations and messages. Trips will be requested in the mobile app, which is not published yet.",
  },
  {
    locale: "en",
    audience: "passenger",
    sortOrder: 2,
    question: "How does DameBola work?",
    answer:
      "When the app is available, the flow will be: create an account, enter pickup and destination, propose a fare, review responses from nearby drivers, and choose one. Today you can read How it works and join the launch list.",
  },
  {
    locale: "en",
    audience: "passenger",
    sortOrder: 3,
    question: "How do I create an account?",
    answer:
      "Passenger accounts will be created in the mobile app. That app is not on the App Store or Google Play yet, so this website cannot open a ride account. You can join the launch list and we will let you know.",
  },
  {
    locale: "en",
    audience: "passenger",
    sortOrder: 4,
    question: "How do I propose a fare?",
    answer:
      "In the app you will enter the amount you want to pay for that trip. The RD$250 and RD$300 example on this site is an illustration only. It is not a quote or a minimum fare.",
  },
  {
    locale: "en",
    audience: "passenger",
    sortOrder: 5,
    question: "Can drivers make a counteroffer?",
    answer:
      "Yes. A driver will be able to accept your price or send a different one. You will be able to accept, decline, or look at another offer. Nobody is required to accept a price.",
  },
  {
    locale: "en",
    audience: "passenger",
    sortOrder: 6,
    question: "How do I choose a driver?",
    answer:
      "Before you confirm, the app is planned to show the offer and the driver information the platform has available. That screen is not live yet. The people shown in website mockups are interface examples, not real drivers.",
  },
  {
    locale: "en",
    audience: "passenger",
    sortOrder: 7,
    question: "How do I cancel a trip?",
    answer:
      "A cancellation policy has not been published because trips in the app are not active. When one exists, it will appear in the app and on the Fares page before it applies. No cancellation fee is published on this website today.",
  },
  {
    locale: "en",
    audience: "passenger",
    sortOrder: 8,
    question: "How do I report a problem?",
    answer:
      "Use the Contact page and choose Report a problem, or email Info@DameBolaApp.com. In-app reporting is marked Coming soon until that feature exists.",
  },
  {
    locale: "en",
    audience: "passenger",
    sortOrder: 9,
    question: "How do I contact support?",
    answer:
      "Use the Contact form or email Info@DameBolaApp.com.",
  },
  {
    locale: "en",
    audience: "driver",
    sortOrder: 1,
    question: "How can I become a driver?",
    answer:
      "Complete the pre-registration on Drive with DameBola. The team will review your information and may ask for more. Sending the form does not approve you and does not let you receive trips today.",
  },
  {
    locale: "en",
    audience: "driver",
    sortOrder: 2,
    question: "What documents are required?",
    answer:
      "DameBola publishes the current requirements on the form, and an administrator can update them. The form can already receive a license, registration, insurance, or another document privately. Uploading a file does not mean it has been verified.",
  },
  {
    locale: "en",
    audience: "driver",
    sortOrder: 3,
    question: "Can I register a motorcycle?",
    answer:
      "Yes. Pre-registration accepts a car or a motorcycle. Acceptance depends on review and on the requirements published at the time.",
  },
  {
    locale: "en",
    audience: "driver",
    sortOrder: 4,
    question: "How are driver applications reviewed?",
    answer:
      "A team member sets the status to Pending, Under review, Approved, Rejected, or More information required. Nothing is approved automatically. Approved, at this stage, does not turn on a driver account in the app.",
  },
  {
    locale: "en",
    audience: "driver",
    sortOrder: 5,
    question: "How does price negotiation work?",
    answer:
      "The rider proposes a fare. You can accept it or send a counteroffer. The two people agree on the price. This website does not publish commissions or minimum fares.",
  },
  {
    locale: "en",
    audience: "driver",
    sortOrder: 6,
    question: "How do I receive trip requests?",
    answer:
      "Requests will arrive in the driver app once that app is published and your account is active. That feature is marked Coming soon. Website pre-registration does not dispatch trips.",
  },
  {
    locale: "en",
    audience: "driver",
    sortOrder: 7,
    question: "How are earnings calculated?",
    answer:
      "Earnings will depend on the trips you accept and the prices you agree. DameBola does not promise a minimum or guaranteed income. Any future commission will be published before it applies. No commission is announced on this website.",
  },
  {
    locale: "en",
    audience: "driver",
    sortOrder: 8,
    question: "How can I contact support?",
    answer:
      "On Contact, choose Driver support or Driver registration, or email Info@DameBolaApp.com. Keep your application reference if you already submitted the form.",
  },
];
