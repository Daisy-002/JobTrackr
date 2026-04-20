import axios from 'axios'

const http = axios.create({ baseURL: 'https://dummyjson.com', timeout: 8000 })

// PRD: Use dummyjson as mock job listings
export async function fetchMockJobs() {
  const res = await http.get('/products?limit=10')
  return res.data.products.map(p => ({
    id: p.id,
    title: p.title,
    brand: p.brand || 'Unknown',
    price: p.price,
    category: p.category,
  }))
}

// PRD: Company logo from Clearbit
export function getLogoUrl(domain) {
  return `https://logo.clearbit.com/${domain}`
}
