// Club Information & Static Knowledge Base
export const CLUB_INFO = {
  name: "IT Community (Saad Dahleb Blida University)",
  shortName: "ITC",
  university: "Saad Dahleb Blida University",
  location: "Saad Dahleb University Campus, Blida",
  meetingLocation: "Room C-204, Tech Wing & MakerSpace",
  regularMeetingTime: "Every Wednesday at 18:00",
  activeMembers: "850+",
  departments: [
    "Mobile & Web Development",
    "Artificial Intelligence & Machine Learning",
    "Cybersecurity & CTF",
    "Robotics & Embedded Systems",
    "UI/UX & Product Design"
  ],
  divisions: [
    "Mobile and Web Dev",
    "Artificial Intelligence",
    "Cybersecurity",
    "Robotics",
    "UI/UX & Product Design"
  ],
  officers: [
    { role: "President", name: "Alex Rivera", email: "president@itc-club.org" },
    { role: "Vice President", name: "Maya Lin", email: "vicepresident@itc-club.org" },
    { role: "Tech Lead", name: "Kaitlyn Chen", email: "tech@itc-club.org" }
  ]
};

export const INITIAL_EVENTS = [
  {
    id: "evt-1",
    _id: "evt-1",
    title: "Full-Stack Web Development with React & Node",
    description: "Build robust, full-stack reactive applications from scratch. Hands-on coding session covering state management, REST APIs, and modern deployment pipelines.",
    date: "2026-11-12",
    time: "14:00",
    location: "Saad Dahleb University Campus, Lab 301",
    category: "Workshop",
    status: "Upcoming",
    isOnline: false,
    capacity: 45,
    registeredCount: 38,
    isUserRegistered: true,
    speaker: {
      name: "Dr. Karim Belkacem",
      role: "Lead Software Architect & Club Advisor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    },
    detailedAgenda: [
      "14:00 - Setup and architecture walkthrough",
      "14:45 - Building reactive frontend components",
      "15:45 - Integrating Express and MongoDB backend",
      "16:30 - Live Q&A and code clinic"
    ],
    prerequisites: "Basic JavaScript & modern web browser. Bring your laptop with Node.js installed."
  },
  {
    id: "evt-2",
    _id: "evt-2",
    title: "ITC Annual 32-Hour Hackathon: Smart Campus",
    description: "Join Blida's largest collegiate hackathon! Collaborate in teams of 2-4 to invent high-impact AI, IoT, and software solutions for smart campuses.",
    date: "2026-11-20",
    time: "09:00",
    location: "Campus Central Amphitheater & MakerSpace",
    category: "Hackathon",
    status: "Upcoming",
    isOnline: false,
    capacity: 120,
    registeredCount: 89,
    isUserRegistered: false,
    speaker: {
      name: "Amira Mansouri",
      role: "Hackathon Director & GDG Mentor",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    detailedAgenda: [
      "09:00 - Opening keynote & challenge reveals",
      "10:30 - Team pairing & brainstorming clinic",
      "12:00 - Hacking begins (Mentors on standby)",
      "Next Day 17:00 - Demos and awards ceremony"
    ],
    prerequisites: "Open to all students. Free meals, snacks, and high-speed Wi-Fi provided."
  },
  {
    id: "evt-3",
    _id: "evt-3",
    title: "AI Agents & LLM Systems Masterclass",
    description: "Deep dive into building multi-turn agentic workflows, function calling with Gemini API, and deploying retrieval-augmented generative AI assistants.",
    date: "2026-11-28",
    time: "15:00",
    location: "Online Stream & Auditorium B",
    category: "Workshop",
    status: "Upcoming",
    isOnline: true,
    capacity: 80,
    registeredCount: 62,
    isUserRegistered: false,
    speaker: {
      name: "Yacine Benali",
      role: "Machine Learning Researcher",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
    },
    detailedAgenda: [
      "15:00 - Foundations of LLM Agent Architectures",
      "15:40 - Implementing tool execution & grounding",
      "16:20 - Real-time streaming and session state",
      "17:00 - Open discussion & source code release"
    ],
    prerequisites: "Basic Python or JavaScript. Access link provided upon registration."
  }
];

// Language detector
function detectLang(text = "") {
  if (/[\u0600-\u06FF]/.test(text)) return "ar";
  if (/[\u00E0-\u00FF]|bonjour|salut|événement|atelier|rejoindre|inscri|club|merci|où|quand|qui|comment/i.test(text)) return "fr";
  return "en";
}

/**
 * Analyzes member query and responds strictly following the controller's system prompt:
 * - You are "ITC Assistant", the assistant of the IT Community club (Saad Dahleb Blida University).
 * - Answer only questions about the club: departments, events, resources.
 * - Reply in the user's language (Arabic, French or English).
 * - If answer is not there, say you don't know and suggest contacting the club leaders.
 */
export function generateClubAssistantResponse(userPrompt, eventsList = INITIAL_EVENTS) {
  const lang = detectLang(userPrompt);
  const q = userPrompt.toLowerCase();

  const isGreeting = /hello|hi|hey|salut|bonjour|bonsoir|مرحبا|أهلا|سلام/i.test(q);
  const hasEvents = /event|upcoming|schedule|workshop|hackathon|évènement|evenement|atelier|فعاليات|فعالية|ورشة|هاكاثون/i.test(q);
  const hasDepts = /department|division|departement|pole|pôle|section|أقسام|قسم/i.test(q);
  const hasJoin = /join|register|membership|participate|cost|free|rejoindre|inscri|adherer|adhesion|gratuit|تسجيل|انضمام|اشتراك|مجاني/i.test(q);
  const hasMeet = /meet|where|location|room|campus|resource|university|blida|saad|dahleb|quand|lieu|salle|ressource|أين|مكان|متى|موعد|جامعة/i.test(q);
  const hasLeaders = /leader|president|contact|officer|responsable|dirigeant|مسؤول|رئيس|تواصل/i.test(q);

  // 1. Arabic
  if (lang === "ar") {
    if (isGreeting) {
      return `مرحباً بك! أنا "ITC Assistant"، المساعد الذكي لنادي مجتمع تكنولوجيا المعلومات (جامعة سعد دحلب بالبليدة).\n\nأنا هنا للإجابة فقط عن أسئلتك حول النادي: أقسامنا، الفعاليات وورش العمل، والموارد المتاحة. كيف يمكنني مساعدتك اليوم؟`;
    }
    if (hasDepts) {
      return `يضم نادي IT Community (جامعة سعد دحلب بالبليدة) خمسة أقسام رئيسية:\n\n1. **تطوير الويب وتطبيقات الهاتف**\n2. **الذكاء الاصطناعي وتعلم الآلة**\n3. **الأمن السيبراني وتحديات CTF**\n4. **الروبوتات وإنترنت الأشياء**\n5. **تصميم واجهات وتجربة المستخدم (UI/UX)**\n\nيمكنك المشاركة في أي قسم وفقاً لشغفك!`;
    }
    if (hasEvents) {
      const bullets = eventsList.map(e => `• **${e.title}** (${e.category}) - ${e.date} في ${e.location}`).join('\n');
      return `إليك أبرز فعاليات وورش عمل نادي IT Community القادمة في جامعة سعد دحلب:\n\n${bullets}\n\nجميع الفعاليات مجانية، ويمكنك حجز مقعدك من صفحة الفعاليات.`;
    }
    if (hasJoin) {
      return `الانضمام إلى نادي IT Community مجاني بنسبة 100% لجميع طلبة جامعة سعد دحلب بالبليدة!\n\nللتسجيل:\n1. اضغط على زر "انضم إلى ITC" في أعلى الصفحة لإنشاء حسابك.\n2. تصفح الفعاليات وسجّل في الورش والمسابقات.\n3. تذاكرك محفوظة في صفحة "تسجيلاتي".`;
    }
    if (hasMeet) {
      return `يلتقي نادي IT Community أسبوعياً كل يوم أربعاء على الساعة 18:00 في قاعة C-204 بالحرم الجامعي (جامعة سعد دحلب بالبليدة). كما نوفر فضاء للمشاريع والتدريب طيلة الأسبوع.`;
    }
    if (hasLeaders) {
      return `يمكنك التواصل مع مسؤولي نادي IT Community عبر البريد الإلكتروني للنادي، خادم Discord، أو مباشرة خلال لقاءات الأربعاء في جامعة سعد دحلب.`;
    }
    return `لا أعلم إجابة هذا السؤال لأنني مساعد نادي IT Community (جامعة سعد دحلب بالبليدة)، وأجيب فقط عن الأسئلة المتعلقة بالنادي (الأقسام، الفعاليات، والموارد). يُرجى التواصل مع مسؤولي النادي لمزيد من المعلومات.`;
  }

  // 2. French
  if (lang === "fr") {
    if (isGreeting) {
      return `Bonjour ! Je suis "ITC Assistant", l'assistant du club IT Community (Université Saad Dahleb Blida).\n\nJe réponds uniquement aux questions concernant le club : départements, événements et ressources. Comment puis-je vous aider ?`;
    }
    if (hasDepts) {
      return `Le club IT Community (Université Saad Dahleb Blida) compte 5 départements actifs :\n\n1. **Développement Web & Mobile**\n2. **Intelligence Artificielle & Machine Learning**\n3. **Cybersécurité & Défense CTF**\n4. **Robotique & Systèmes Embarqués**\n5. **Design UI/UX & Produit**\n\nChaque département organise des sessions pratiques et des projets d'équipe.`;
    }
    if (hasEvents) {
      const bullets = eventsList.map(e => `• **${e.title}** (${e.category}) - ${e.date} à ${e.location}`).join('\n');
      return `Voici les prochains événements et ateliers de l'IT Community à l'Université Saad Dahleb Blida :\n\n${bullets}\n\nTous les événements sont 100% gratuits pour les membres. Réservez votre place sur la page Événements.`;
    }
    if (hasJoin) {
      return `L'adhésion au club IT Community est 100% gratuite pour tous les étudiants de l'Université Saad Dahleb Blida !\n\nPour nous rejoindre :\n1. Cliquez sur le bouton "Rejoindre l'ITC" en haut à droite.\n2. Créez votre compte membre gratuitement.\n3. Inscrivez-vous aux ateliers et hackathons depuis l'onglet Événements.`;
    }
    if (hasMeet) {
      return `Le club IT Community se réunit chaque mercredi à 18h00 sur le campus de l'Université Saad Dahleb Blida (Salle C-204 & MakerSpace).`;
    }
    if (hasLeaders) {
      return `Vous pouvez contacter les responsables du club IT Community par email, via le Discord officiel du club ou lors des réunions hebdomadaires.`;
    }
    return `Je ne connais pas la réponse à cette question car je suis l'assistant du club IT Community (Université Saad Dahleb Blida) et je réponds uniquement aux questions concernant le club (départements, événements et ressources). Veuillez contacter les responsables du club pour plus d'informations.`;
  }

  // 3. English (Default)
  if (isGreeting) {
    return `Hello! I am "ITC Assistant", the official assistant of the IT Community club (Saad Dahleb Blida University).\n\nI answer questions only about the club: departments, upcoming events, and club resources. How can I assist you today?`;
  }
  if (hasDepts) {
    return `The IT Community club (Saad Dahleb Blida University) has 5 specialized departments:\n\n1. **Mobile & Web Development**\n2. **Artificial Intelligence & Machine Learning**\n3. **Cybersecurity & CTF**\n4. **Robotics & Embedded Systems**\n5. **UI/UX & Product Design**\n\nAll members are welcome to collaborate across any department!`;
  }
  if (hasEvents) {
    const bullets = eventsList.map(e => `• **${e.title}** (${e.category}) on ${e.date} at ${e.time} — ${e.location}`).join('\n');
    return `Here are our upcoming IT Community events at Saad Dahleb Blida University:\n\n${bullets}\n\nYou can view full agendas, prerequisites, and reserve your spot on the Events page!`;
  }
  if (hasJoin) {
    return `Joining IT Community is 100% free for all students at Saad Dahleb Blida University!\n\nTo join:\n1. Click the "Join ITC" button in the header.\n2. Fill in your name and email to create your account.\n3. Explore upcoming events and claim your digital pass!`;
  }
  if (hasMeet) {
    return `IT Community meets every Wednesday at 18:00 at the Saad Dahleb Blida University Campus (Room C-204 / MakerSpace).`;
  }
  if (hasLeaders) {
    return `You can reach the IT Community club leadership via our official Discord server, email, or in-person during our Wednesday campus meetups.`;
  }

  return `I don't know the answer to that as I am the ITC Assistant and only answer questions about the IT Community club (departments, events, and resources). Please contact the club leaders for more information.`;
}
