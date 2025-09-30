export interface Organization {
  name: string;
  ein: string;
  status: string;
  bmfStatus: string;
  pub78Status: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  website: string;
  mission: string;
  foundedYear: string;
  taxExemptStatus: string;
  lastUpdated: string;
}

export interface Compliance {
  isCompliant: boolean;
  bmfCompliant: boolean;
  pub78Compliant: boolean;
  lastVerified: string;
  flags: string[];
  warnings: string[];
}

export interface SourceMatches {
  bmfMatch: boolean;
  pub78Match: boolean;
  confidence: number;
}

export interface NonprofitResponse {
  success: boolean;
  data: {
    organization: Organization;
    compliance: Compliance;
    sourceMatches: SourceMatches;
  };
  timestamp: string;
}

export interface SearchRequest {
  ein?: string;
  organizationName?: string;
}

export interface SearchHistoryItem {
  id: string;
  userId: number;
  username: string;
  searchType: string;
  searchValue: string;
  timestamp: string;
  result: {
    organization: Organization;
    compliance: Compliance;
    sourceMatches: SourceMatches;
  };
}


