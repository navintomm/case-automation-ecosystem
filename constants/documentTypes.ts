export interface DocumentTypeItem {
  id: string;
  name: string;
  code: string; // Used for file naming pattern e.g., WritPetition
}

export interface DocumentTypeGroup {
  name: string;
  items: DocumentTypeItem[];
}

export const DOCUMENT_TYPE_GROUPS: DocumentTypeGroup[] = [
  {
    name: 'Writ Jurisdiction',
    items: [
      { id: 'writ_wp', name: 'Writ Petition (Civil) - WP(C)', code: 'WritPetition' },
      { id: 'writ_wac', name: 'Writ Appeal - WA', code: 'WritAppeal' },
      { id: 'writ_cont', name: 'Contempt Case (Civil) - COC', code: 'ContemptPetition' },
    ]
  },
  {
    name: 'Civil Proceedings',
    items: [
      { id: 'civil_suit_inj', name: 'Suit for Permanent Injunction', code: 'SuitInjunction' },
      { id: 'civil_suit_rec', name: 'Suit for Money Recovery', code: 'SuitRecovery' },
      { id: 'civil_suit_part', name: 'Suit for Partition', code: 'SuitPartition' },
      { id: 'civil_op', name: 'Original Petition (OP)', code: 'OriginalPetition' },
      { id: 'civil_cma', name: 'Civil Miscellaneous Appeal (CMA)', code: 'CivilMiscAppeal' },
      { id: 'civil_as', name: 'Regular First Appeal (AS)', code: 'FirstAppeal' },
    ]
  },
  {
    name: 'Family Court',
    items: [
      { id: 'fam_div', name: 'Petition for Dissolution of Marriage (Divorce)', code: 'DivorcePetition' },
      { id: 'fam_maint', name: 'Petition for Maintenance under Sec 125 CrPC', code: 'MaintenancePetition' },
      { id: 'fam_cust', name: 'Petition for Child Custody & Guardianship', code: 'CustodyPetition' },
      { id: 'fam_rest', name: 'Petition for Restitution of Conjugal Rights', code: 'RestitutionConjugal' },
    ]
  },
  {
    name: 'Motor Accident',
    items: [
      { id: 'mac_claim', name: 'Claim Petition before MACT (OP-MV)', code: 'MACTClaim' },
      { id: 'mac_appeal', name: 'Motor Accident Claims Appeal (MACA)', code: 'MACTAppeal' },
    ]
  },
  {
    name: 'Criminal',
    items: [
      { id: 'crim_bail', name: 'Bail Application (under Sec 438/439 CrPC)', code: 'BailApplication' },
      { id: 'crim_mc', name: 'Criminal Miscellaneous Case (MC)', code: 'CrimMiscCase' },
      { id: 'crim_appeal', name: 'Criminal Appeal', code: 'CriminalAppeal' },
      { id: 'crim_rev', name: 'Criminal Revision Petition', code: 'CrimRevision' },
    ]
  },
  {
    name: 'Consumer',
    items: [
      { id: 'cons_comp', name: 'Consumer Complaint (CC)', code: 'ConsumerComplaint' },
      { id: 'cons_appeal', name: 'First Appeal before State Commission', code: 'ConsumerAppeal' },
    ]
  },
  {
    name: 'Rent Control',
    items: [
      { id: 'rent_rcp', name: 'Rent Control Petition (RCP)', code: 'RentControlPetition' },
      { id: 'rent_rca', name: 'Rent Control Appeal (RCA)', code: 'RentControlAppeal' },
    ]
  }
];
