/**
 * Normalizes job data to ensure it conforms to the MVP schema.
 * 
 * MVP Schema expects:
 * - job.company.{name, phone, email, address}
 * - job.policyholder.{name, phone, address}
 * - job.claim.{claimId, typeOfLoss, dateOfLoss, carrier, adjuster, summary}
 * 
 * Wizard Schema provides:
 * - jobName, claimNumber, lossType, dateOfLoss, companyName
 * - contact.{phone, email, address}
 * - property.{address, insured, insurer, adjuster}
 * - notes (various)
 * 
 * @param {Object} job - The job object to normalize
 * @returns {Object} - Normalized job object
 */
export const normalizeJob = (job) => {
  // If job is null or undefined, return empty structure
  if (!job) {
    return {
      company: { name: '—', phone: '—', email: '—', address: '—' },
      policyholder: { name: '—', phone: '—', address: '—' },
      claim: { claimId: '—', typeOfLoss: 'Water', dateOfLoss: '—', carrier: '—', adjuster: '—', summary: '' },
    };
  }

  // If job already has the MVP schema structure, return it unchanged
  if (job.claim && job.policyholder && job.company) {
    return job;
  }

  // Otherwise, map wizard-style fields to MVP schema
  const normalized = {
    ...job, // Preserve all original fields
    
    company: job.company || {
      name: job.companyName || '—',
      phone: job.contact?.phone || '—',
      email: job.contact?.email || '—',
      address: job.contact?.address || '—',
      logoUrl: job.company?.logoUrl || undefined,
    },
    
    policyholder: job.policyholder || {
      name: job.property?.insured || '—',
      phone: job.contact?.phone || '—',
      address: job.property?.address || '—',
    },
    
    claim: job.claim || {
      claimId: job.claimNumber || '—',
      typeOfLoss: job.lossType || 'Water',
      dateOfLoss: job.dateOfLoss || '—',
      carrier: job.property?.insurer || '—',
      adjuster: job.property?.adjuster || '—',
      summary: job.notes?.general || job.notes?.scope || '',
    },
  };

  return normalized;
};

export default normalizeJob;
