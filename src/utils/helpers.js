import { format, parseISO, formatDistanceToNow, isAfter } from 'date-fns'

export function formatDate(str) {
  if (!str) return '—'
  try { return format(parseISO(str), 'dd MMM yyyy') }
  catch { return str }
}

export function formatSalary(n) {
  const num = Number(n)
  if (!num) return '—'
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`
  return `₹${num.toLocaleString('en-IN')}`
}

export function timeAgo(str) {
  if (!str) return ''
  try { return formatDistanceToNow(parseISO(str), { addSuffix: true }) }
  catch { return '' }
}

export function isUpcoming(str) {
  if (!str) return false
  try { return isAfter(parseISO(str), new Date()) }
  catch { return false }
}

export const STATUS_LIST = [
  'Applied',
  'Shortlisted',
  'Interview Scheduled',
  'Offer Received',
  'Rejected',
]

export const PLATFORM_LIST = [
  'LinkedIn',
  'Naukri',
  'Indeed',
  'AngelList',
  'Company Website',
  'Campus Placement',
  'Referral',
  'Other',
]

export const LOCATION_TYPES = [
  { value: 'onsite',  label: 'On-site' },
  { value: 'remote',  label: 'Remote' },
  { value: 'hybrid',  label: 'Hybrid' },
]

export function statusBadgeClass(status) {
  const map = {
    'Applied':            'b-applied',
    'Shortlisted':        'b-shortlisted',
    'Interview Scheduled':'b-interview',
    'Offer Received':     'b-offer',
    'Rejected':           'b-rejected',
  }
  return map[status] || 'b-applied'
}

export function getLogoDomain(company) {
  const known = {
    google: 'google.com', microsoft: 'microsoft.com', amazon: 'amazon.com',
    flipkart: 'flipkart.com', infosys: 'infosys.com', wipro: 'wipro.com',
    tcs: 'tcs.com', razorpay: 'razorpay.com', swiggy: 'swiggy.com',
    zomato: 'zomato.com', paytm: 'paytm.com', phonepe: 'phonepe.com',
    uber: 'uber.com', adobe: 'adobe.com', apple: 'apple.com',
    meta: 'meta.com', netflix: 'netflix.com', spotify: 'spotify.com',
    twitter: 'twitter.com', linkedin: 'linkedin.com', oracle: 'oracle.com',
    ibm: 'ibm.com', salesforce: 'salesforce.com',
  }
  const key = company.toLowerCase().replace(/\s+/g, '')
  return known[key] || `${key}.com`
}
