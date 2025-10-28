// src/types/domainTypes.ts

/** Payload for create/update */
export interface DomainRequestDto {
  businessId: string;
  domainName?: string;
  domainUrl: string; // e.g. "khan-food-bakery.storemins.com"
  domainType: "SUBDOMAIN" | "CUSTOM";
  verificationCode?: string;
  sslCertificateId?: string;
  id?: string;
}

/** Response from server */
export interface DomainResponseDto {
  id: string;
  businessId: string;
  domainName?: string;
  domain: string;
  domainType: "SUBDOMAIN" | "CUSTOM";
  verificationStatus: "PENDING" | "VERIFIED" | "FAILED";
  verificationCode?: string;
  sslCertificateId?: string;
}

/** For listing / searching */
export interface ListDomainsParams {
  // page?: number;
  // limit?: number;
  search?: string;
}

// ➕ SSL Certificate DTO
export interface SSLCertificateDto {
  id: string;
  issuer: string;
  expiryDate: string; // ISO date string
}

// ➕ Full response for /seller/business/domains/me
export interface DomainWithSSLResponseDto {
  id: string;
  businessId: string;
  domainName?: string | null;
  domain: string;
  domainType: "SUBDOMAIN" | "CUSTOM";
  verificationStatus: "PENDING" | "VERIFIED" | "FAILED" | "EXPIRED";
  verificationCode?: string | null;
  isActive: boolean;
  verificationDate?: string | null;
  sslCertificate?: SSLCertificateDto | null;
  createdAt: string;
  updatedAt: string;
}
