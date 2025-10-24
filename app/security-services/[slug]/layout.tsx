// app/services/[slug]/layout.tsx
import type { Metadata } from "next";
import services from "@/app/data/services";

interface ServiceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>; // Changed to Promise
}

// Dynamically generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>; // Changed to Promise
}): Promise<Metadata> {
  // IMPORTANT: Await params in Next.js 15+
  const { slug } = await params;
  
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return {
      title: "Service Not Found | Sachin Security",
      description: "The requested service page could not be found.",
    };
  }

  return {
    title: `${service.title} | Sachin Security Services`,
    description: service.description,
    keywords: [
      service.title,
      'Sachin Security',
      'Security Services',
      'Vadodara',
      'Gujarat',
      ...service.industries.slice(0, 5)
    ],
    openGraph: {
      title: `${service.title} | Sachin Security Services`,
      description: service.description,
      images: [
        {
          url: service.image,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
      type: "website",
      siteName: "Sachin Security Services Pvt. Ltd.",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | Sachin Security Services`,
      description: service.description,
      images: [service.image],
      creator: "@sachinsecurity",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `https://sachinsecurity.co.in/services/${slug}`,
    },
  };
}

// Generate static params for all services
export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

// Layout wrapper
export default function ServiceLayout({
  children,
}: ServiceLayoutProps) {
  return <>{children}</>;
}
