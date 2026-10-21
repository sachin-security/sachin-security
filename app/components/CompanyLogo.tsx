import Image from 'next/image';
export default function CompanyLogo({ size = 42, className = '' }: { size?: number; className?: string }) {
  return <span className={`hrms-company-logo ${className}`} style={{ width: size, height: size }}><Image src="/hrms-logo.jpg" alt="Sachin Security Services — since 1996" width={size} height={size} className="object-contain h-full w-full" /></span>;
}
