export type College = { id: number; name: string; category: string; interest: string; applicationType: string; deadline: string; major: string; status: string; netPrice: number; netPriceKnown?: boolean; notes: string; essays: boolean; recommendations: boolean; transcript: boolean; fafsa: boolean };
export type Accomplishment = { id: number; title: string; category: string; date: string; impact: string; evidence: string; hours?: number; shareWithFamily?: boolean };
export type Scholarship = { id: number; name: string; amount: number; deadline: string; status: string; url: string; requirements: string };
export type AidOffer = { id: number; college: string; grants: number; scholarships: number; loans: number; workStudy: number; totalCost: number };
export type Essay = { id: number; college: string; prompt: string; deadline: string; wordLimit: number; draft: string; status: string };
export type Collaborator = { id: number; name: string; role: string; email: string };
export type OrganizerData = { colleges: College[]; accomplishments: Accomplishment[]; scholarships: Scholarship[]; aidOffers: AidOffer[]; essays: Essay[]; collaborators: Collaborator[] };


export const emptyOrganizer: OrganizerData = { colleges: [], accomplishments: [], scholarships: [], aidOffers: [], essays: [], collaborators: [] };
