export type OrganizationPlan = "free" | "pro" | "business";

export interface OrganizationBranding {
  logoUrl: string | null;
  primaryColor: string | null;
}

export interface Organization {
  id: string;
  name: string;
  plan: OrganizationPlan;
  ownerUserId: string;
  branding: OrganizationBranding;
  createdAt: Date;
}

export type MemberRole = "owner" | "admin" | "member";

export interface OrganizationMember {
  userId: string;
  organizationId: string;
  role: MemberRole;
  joinedAt: Date;
}
