import { useState, useEffect, useRef } from 'react';
import { useCaseStore } from '../store/caseStore';

export function useAutoSave() {
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Watch the fields that represent form data
  const district = useCaseStore(s => s.district);
  const court = useCaseStore(s => s.court);
  const documentType = useCaseStore(s => s.documentType);
  const parties = useCaseStore(s => s.parties);
  const uploadedDocs = useCaseStore(s => s.uploadedDocs);
  const chronology = useCaseStore(s => s.chronology);
  const factualSynopsis = useCaseStore(s => s.factualSynopsis);
  const legalStrategy = useCaseStore(s => s.legalStrategy);
  const causeOfAction = useCaseStore(s => s.causeOfAction);
  const prayers = useCaseStore(s => s.prayers);
  const witnesses = useCaseStore(s => s.witnesses);
  const valuation = useCaseStore(s => s.valuation);
  const companionDocs = useCaseStore(s => s.companionDocs);
  
  // Also track some dates
  const draftingDate = useCaseStore(s => s.draftingDate);
  const causeOfActionDate = useCaseStore(s => s.causeOfActionDate);

  // We use a ref to prevent saving on the very first mount if not desired, 
  // but saving on mount is fine for "auto save".
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    setSaveState('saving');

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setSaveState('saved');
      
      // Go back to idle after 2.5 seconds
      setTimeout(() => {
        setSaveState(current => current === 'saved' ? 'idle' : current);
      }, 2500);
      
    }, 1500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    district, court, documentType, parties, uploadedDocs,
    chronology, factualSynopsis, legalStrategy, causeOfAction,
    prayers, witnesses, valuation, companionDocs,
    draftingDate, causeOfActionDate
  ]);

  return saveState;
}
