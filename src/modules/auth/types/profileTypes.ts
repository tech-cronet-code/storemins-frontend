    // src/types/profileTypes.ts
    export type DomainType = "SUBDOMAIN" | "CUSTOM";
    export type DomainVerificationStatus = "PENDING" | "VERIFIED" | "FAILED";
    export type BusinessStatus = "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION";
    export type UserRoleName = "OWNER" | "MANAGER" | "STAFF" | "ADMIN";

    export interface DomainInfoDto {
    domain?: string | null;
    domainType: DomainType;
    isActive: boolean;
    verificationStatus: DomainVerificationStatus;
    }

    export interface StoreLinkDto {
    id: string;
    businessId: string;
    role: UserRoleName;
    businessName: string;
    status: BusinessStatus;
    domain: DomainInfoDto | null;
    }

    export interface GetMyProfileDto {
    id: string;
    name: string;
    mobile: string;
    tenantId: string | null;
    storeLinks: StoreLinkDto[];
    isDomainLinked: boolean;
    role: string[];
    }
