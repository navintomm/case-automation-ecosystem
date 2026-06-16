export interface CompanionDocItem {
  id: string;
  label: string;
  hasSubForm?: 'witness' | 'valuation';
  alwaysOn?: boolean;
}

export interface CompanionDocGroup {
  id: string;
  title: string;
  items: CompanionDocItem[];
}

export const COMPANION_DOCS_GROUPS: CompanionDocGroup[] = [
  {
    id: '4.1',
    title: '4.1 Vakalath / Memo of Appearance',
    items: [
      { id: '4.1.vakalath', label: 'Vakalath' },
      { id: '4.1.memo', label: 'Memo of Appearance' }
    ]
  },
  {
    id: '4.2',
    title: '4.2 Interlocutory Application (IA)',
    items: [
      { id: '4.2.delay', label: 'Delay Condonation Petition' },
      { id: '4.2.stay', label: 'Stay Petition' },
      { id: '4.2.interim_inj', label: 'Interim Injunction Application' },
      { id: '4.2.temp_inj', label: 'Temporary Injunction Application' },
      { id: '4.2.commissioner', label: 'Appointment of Commissioner' },
      { id: '4.2.impleading', label: 'Impleading Petition' },
      { id: '4.2.amendment', label: 'Amendment Petition' },
      { id: '4.2.restoration', label: 'Restoration Petition' },
      { id: '4.2.advancement', label: 'Advancement Petition' },
      { id: '4.2.early_hearing', label: 'Early Hearing Petition' },
      { id: '4.2.review', label: 'Review Petition' },
      { id: '4.2.other_ia', label: 'Other IA Application' }
    ]
  },
  {
    id: '4.3',
    title: '4.3 Criminal Miscellaneous Petition (CMP)',
    items: [
      { id: '4.3.sentence_susp', label: 'Sentence Suspension Petition' },
      { id: '4.3.vehicle_rel', label: 'Vehicle Release Petition' },
      { id: '4.3.property_rel', label: 'Property Release Petition' },
      { id: '4.3.passport_ret', label: 'Return of Passport Petition' },
      { id: '4.3.bail_cond', label: 'Modification of Bail Conditions' },
      { id: '4.3.warrant_canc', label: 'Cancellation of Warrant Petition' },
      { id: '4.3.recall', label: 'Recall Petition' },
      { id: '4.3.custody', label: 'Interim Custody Petition' },
      { id: '4.3.other_crim', label: 'Other Criminal Applications' }
    ]
  },
  {
    id: '4.4',
    title: '4.4 Affidavits',
    items: [
      { id: '4.4.supporting', label: 'Supporting Affidavit' },
      { id: '4.4.additional', label: 'Additional Affidavit' }
    ]
  },
  {
    id: '4.5',
    title: '4.5 Document List',
    items: [
      { id: '4.5.document_list', label: 'Auto-generated from uploads', alwaysOn: true }
    ]
  },
  {
    id: '4.6',
    title: '4.6 Witness List',
    items: [
      { id: '4.6.witness_list', label: 'Add Witness List', hasSubForm: 'witness' }
    ]
  },
  {
    id: '4.7',
    title: '4.7 Valuation & Court Fee Statement',
    items: [
      { id: '4.7.valuation_stmt', label: 'Valuation Statement', hasSubForm: 'valuation' },
      { id: '4.7.court_fee', label: 'Court Fee Calculation Sheet', hasSubForm: 'valuation' }
    ]
  },
  {
    id: '4.8',
    title: '4.8 Batta Memo',
    items: [
      { id: '4.8.batta', label: 'Batta Memo' }
    ]
  }
];
