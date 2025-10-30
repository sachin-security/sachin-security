// components/CertificatesGallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Award, Calendar, FileText, Building } from 'lucide-react';

interface Certificate {
  id: string;
  img: string;
  title: string;
  issueAuthority: string;
  licenseNumber: string;
  issueDate: string;
  validUpto: string;
  description: string;
  category: string;
}

interface CertificatesGalleryProps {
  certificates: Certificate[];
}

// data/certificates.ts
export const certificates:Certificate[] = [
  {
    id: 'cert-1',
    img: 'upl.jpg',
    title: 'Security License - Uttar Pradesh',
    issueAuthority: 'Government of Uttar Pradesh',
    licenseNumber: 'PSA/**********/3/49',
    issueDate: '26/02/2021',
    validUpto: '25/02/2026',
    description: 'Official license to provide private security services in Uttar Pradesh',
    category: 'State License'
  },
  {
    id: 'cert-2',
    img: 'mpl.jpg',
    title: 'Security License - Madhya Pradesh',
    issueAuthority: 'Government of Madhya Pradesh',
    licenseNumber: '191164',
    issueDate: '04/06/2019',
    validUpto: '03/06/2024',
    description: 'Official license to provide private security services in Madhya Pradesh',
    category: 'State License'
  },
  {
    id: 'cert-3',
    img: 'gl.jpg',
    title: 'Security License - Gujarat',
    issueAuthority: 'Government of Gujarat',
    licenseNumber: 'PSA/*********/1706',
    issueDate: '07/06/2023',
    validUpto: '06/06/2018',
    description: 'Official license to provide private security services in Gujarat',
    category: 'State License'
  },
  {
    id: 'cert-4',
    img: 'dndl.jpg',
    title: 'Security License - Diu & Daman',
    issueAuthority: 'UT Administration of Diu & Daman',
    licenseNumber: 'PSA/************2/6',
    issueDate: '15/12/2021',
    validUpto: '14/12/2026',
    description: 'Official license to provide private security services in Diu & Daman',
    category: 'State License'
  },
  {
    id: 'cert-5',
    img: 'udyaml.jpg',
    title: 'Udyam Registration Certificate',
    issueAuthority: 'Ministry of MSME, Government of India',
    licenseNumber: 'UDYAM-GJ-24-0061781',
    issueDate: '12 Feb 2021',
    validUpto: 'Lifetime Validity',
    description: 'Official MSME registration certificate under Udyam scheme',
    category: 'Registration'
  }
];

export default function CertificatesGallery() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (cert: Certificate, index: number) => {
    setSelectedCert(cert);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedCert(null);
  };

  const goToPrevious = () => {
    const newIndex = (currentIndex - 1 + certificates.length) % certificates.length;
    setCurrentIndex(newIndex);
    setSelectedCert(certificates[newIndex]);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % certificates.length;
    setCurrentIndex(newIndex);
    setSelectedCert(certificates[newIndex]);
  };

  return (
    <div className="w-full">
      {/* Grid Display */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, index) => (
          <div
            key={cert.id}
            onClick={() => openModal(cert, index)}
            className="group border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
          >
            {/* Certificate Image */}
            <div className="relative h-80">
              <Image
                src={'/'+cert.img}
                alt={cert.title}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform"
              />
              <div className="absolute top-3 right-3">
                <span className="bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {cert.category}
                </span>
              </div>
            </div>

            {/* Certificate Info */}
            <div className="p-4 text-slate-500">
              <h3 className="text-lg font-bold mb-2 line-clamp-2">
                {cert.title}
              </h3>
              <p className="text-sm mb-3 line-clamp-2">
                {cert.description}
              </p>
              
              <div className="flex items-center gap-2 text-xs">
                <Building className="w-3 h-3" />
                <span className="line-clamp-1">{cert.issueAuthority}</span>
              </div>
              
              <button className="mt-4 w-full py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-600 font-medium text-sm">
                View Certificate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="relative rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10">
              <div className="flex items-start justify-between">
                <div className="text-white">
                  <h2 className="text-2xl font-bold mb-1">{selectedCert.title}</h2>
                  <p className="text-sm opacity-90">{selectedCert.issueAuthority}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Certificate Image */}
            <div className="relative h-[70vh] bg-gray-100 flex items-center justify-center">
              <Image
                src={'/'+selectedCert.img}
                alt={selectedCert.title}
                fill
                className="object-contain"
                quality={100}
              />

              {/* Navigation Arrows */}
              {certificates.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Details Panel */}
            <div className="p-6 bg-white border-t border-gray-200">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">License Number</p>
                    <p className="font-semibold text-gray-900">{selectedCert.licenseNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Issue Date</p>
                    <p className="font-semibold text-gray-900">{selectedCert.issueDate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Valid Upto</p>
                    <p className="font-semibold text-gray-900">{selectedCert.validUpto}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Category</p>
                    <p className="font-semibold text-gray-900">{selectedCert.category}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-700">{selectedCert.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
