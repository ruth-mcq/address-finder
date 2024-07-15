export interface Address {
  placeId: string;
  streetNumber?: string | undefined;
  streetName: string | undefined;
  municipality?: string | undefined;
  postalCode?: string | undefined;
  countryCode: string | undefined;
  country: string | undefined;
  freeformAddress: string | undefined;
}

export class ValidationError extends Error {
  name = "ValidationError";
  constructor(message: string) {
    super(message);
    this.stack = undefined;
  }
}
export class AuthenticationError extends Error {
  name = "AuthenticationError";
  constructor(message: string) {
    super(message);
    this.stack = undefined;
  }
}
export class UnknownError extends Error {
  name = "UnknownError";
  constructor(message: string) {
    super(message);
    this.stack = undefined;
  }
}

export interface MapApiResult {
  type: string;
  id: string;
  score: number;
  address: TomTomAddress;
  position: Position;
  viewport: Viewport;
}

export interface TomTomAddress {
  streetNumber: string;
  streetName: string;
  municipality?: string;
  countrySecondarySubdivision: string;
  countrySubdivision: string;
  countrySubdivisionName: string;
  countrySubdivisionCode: string;
  countryCode: string;
  country: string;
  countryCodeISO3: string;
  freeformAddress: string;
  localName?: string;
  municipalitySubdivision?: string;
  postalCode?: string;
  neighbourhood?: string;
}

export interface Position {
  lat: number;
  lon: number;
}

export interface Viewport {
  topLeftPoint: TopLeftPoint;
  btmRightPoint: BtmRightPoint;
}

export interface TopLeftPoint {
  lat: number;
  lon: number;
}

export interface BtmRightPoint {
  lat: number;
  lon: number;
}
