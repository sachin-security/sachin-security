import { ShieldCheck, Camera,Landmark, Search, Factory, PartyPopper, HardHat, ShoppingBag, UserCheck, Lock, Building } from 'lucide-react';

export interface Service {
  icon: any;
  title: string;
  slug: string;
  image: string;
  shortDescription: string;
  description: string;
  features: string[];
  industries: string[];
  benefits: string[];
  keywords: string[];
}

const services: Service[] = [
  {
    icon: Factory,
    title: "Industrial Security",
    slug: "industrial-security",
    image: "/factory.jpg",
    shortDescription:
      "Security solutions for manufacturing units and warehouses.",
    description: `We provide round-the-clock industrial protection, access management, and compliance with safety regulations.`,
    features: [
      "Perimeter checks",
      "Material gate pass management",
      "24/7 patrolling",
    ],
    industries: ["Factories", "Logistics", "Warehouses"],
    benefits: ["Asset protection", "Safe operations"],
    keywords: ["industrial guard", "factory security"],
  },
  {
    icon: Building,
    title: "Corporate Security Services",
    slug: "corporate-security-services",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    shortDescription: "Comprehensive security for offices and corporate parks.",
    description: `We protect corporate environments with trained guards, access control, and visitor management ensuring a safe workplace.`,
    features: [
      "Access control & ID checks",
      "Lobby and reception security",
      "Emergency drills and fire safety",
    ],
    industries: ["IT", "Finance", "Manufacturing"],
    benefits: ["Safe corporate environment", "Professional appearance"],
    keywords: ["corporate security", "office guard", "business safety"],
  },
  {
    icon: Lock,
    title: "Private Security",
    slug: "private-security",
    image:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&q=80",
    shortDescription: "Dedicated guards for private properties and individuals.",
    description: `We deploy trained and licensed personnel for static and mobile assignments, ensuring safety in residences, hotels, and private spaces.`,
    features: [
      "24/7 on-site protection",
      "Visitor verification",
      "Emergency handling",
    ],
    industries: ["Residences", "Hotels", "Warehouses"],
    benefits: ["Personalized security", "Quick incident response"],
    keywords: ["private guard", "residential security"],
  },
  {
    icon: ShieldCheck,
    title: "Armed / Unarmed Guard",
    slug: "armed-unarmed-guard",
    image: "/armunarm.jpg",
    shortDescription:
      "Licensed armed and unarmed guards for any level of security requirement.",
    description: `All guards are trained, verified, and licensed under state regulations for both static and mobile duties.`,
    features: [
      "Armed & unarmed deployment",
      "Background verified personnel",
      "Mobile patrol support",
    ],
    industries: ["Banks", "Corporate", "Retail"],
    benefits: ["High deterrence", "Professional conduct"],
    keywords: ["armed guard", "unarmed guard", "security officer"],
  },
  {
    icon: ShoppingBag,
    title: "Retail Security",
    slug: "retail-security",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    shortDescription:
      "Loss prevention, CCTV monitoring, and in-store safety for retail outlets.",
    description: `We provide tailored retail security solutions considering store size, location, and history of offences to reduce theft and ensure customer safety.`,
    features: [
      "Loss prevention officers",
      "CCTV and alarm monitoring",
      "Emergency assistance",
    ],
    industries: ["Supermarkets", "Malls", "Showrooms"],
    benefits: [
      "Reduced shrinkage and loss",
      "Safer customer environment",
    ],
    keywords: ["retail security", "loss prevention", "store guard"],
  },
  {
    icon: HardHat,
    title: "Construction Site Security",
    slug: "construction-site-security",
    image:'/construction.jpg',
    shortDescription:
      "24/7 site security to protect assets, equipment, and personnel.",
    description: `We provide comprehensive security for construction sites, preventing theft, vandalism, and unauthorized access. Our guards verify credentials, monitor activities, and report any irregularities.`,
    features: [
      "Entry/exit logging",
      "Regular patrols and CCTV surveillance",
      "Fire hazard reporting",
      "Weekend and night guard availability",
    ],
    industries: ["Real Estate", "Infrastructure", "Contracting"],
    benefits: [
      "Minimized theft and vandalism",
      "Continuous safety compliance",
    ],
    keywords: ["construction security", "site guard", "building protection"],
  },
  {
    icon: PartyPopper,
    title: "Event Security",
    slug: "event-security",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
    shortDescription:
      "Specialized security planning and crowd control for public and private events.",
    description: `At Sachin Security, we develop specialized security plans specifically tailored for every special event. These plans are carried out in collaboration with event organizers, local law enforcement agencies, and emergency services, ensuring seamless coordination. Our personnel handle ticket validation, access control, and crowd management.`,
    features: [
      "Customized event security strategy",
      "Collaboration with police and emergency services",
      "Crowd control and entry management",
      "Emergency response readiness",
    ],
    industries: ["Concerts", "Weddings", "Corporate Events", "Sports Events"],
    benefits: [
      "Reduced risk of crowd incidents",
      "Professional event handling",
      "Peace of mind for organizers",
    ],
    keywords: [
      "event security",
      "crowd management",
      "VIP protection",
      "concert safety",
    ],
  },
  {
    icon: Landmark,
    title: "Bank Escorts",
    slug: "bank-escorts",
    image:
      "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&q=80",
    shortDescription:
      "Trained armed escorts for cash and valuable asset transportation.",
    description: `Our specialized team ensures secure transit operations following strict safety and communication protocols.`,
    features: [
      "Armed vehicle escorts",
      "GPS tracking",
      "Coordination with bank officials",
    ],
    industries: ["Banks", "ATMs", "Financial Institutions"],
    benefits: ["Safe asset transfer", "Reliable armed protection"],
    keywords: ["cash escort", "bank guard", "cash transit security"],
  },
  {
    icon: UserCheck,
    title: "VIP Security",
    slug: "vip-security",
    image: "/vip.jpg",
    shortDescription:
      "Elite personal protection for executives, celebrities, and dignitaries.",
    description: `Our highly trained protection officers ensure complete safety with discreet and effective close protection services during events or travel.`,
    features: [
      "Close protection specialists",
      "Secure transport escorts",
      "Venue risk assessments",
      "24/7 availability",
    ],
    industries: ["Entertainment", "Corporate", "Government"],
    benefits: ["Personal safety", "Confidentiality"],
    keywords: ["vip protection", "bodyguard", "executive security"],
  },
  {
    icon: Camera,
    title: "CCTV Monitoring",
    slug: "cctv-monitoring",
    image:
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80",
    shortDescription: "Real-time surveillance through advanced CCTV systems.",
    description: `We operate centralized monitoring centers with trained operators ensuring instant detection and response to incidents.`,
    features: ["24/7 live monitoring", "Incident detection", "Remote alerts"],
    industries: ["Banks", "Hospitals", "Apartments"],
    benefits: ["Continuous safety coverage", "Immediate threat detection"],
    keywords: ["cctv", "monitoring", "surveillance"],
  },
  {
    icon: Search,
    title: "Investigation Services",
    slug: "investigation-services",
    image:
      "https://images.unsplash.com/photo-1575505586569-646b2ca898fc?w=800&q=80",
    shortDescription:
      "Professional investigation and background verification services.",
    description: `Our investigators conduct discreet background checks, fraud detection, and corporate due diligence.`,
    features: [
      "Corporate fraud detection",
      "Background verification",
      "Legal evidence collection",
    ],
    industries: ["Corporate", "Insurance", "Legal"],
    benefits: ["Confidential results", "Accurate reporting"],
    keywords: ["investigation", "private detective", "fraud check"],
  },
];

export default services;
