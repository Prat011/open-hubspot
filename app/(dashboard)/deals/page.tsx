import { getDeals, getCompanies } from '@/app/actions';
import DealsClient from './client';

export default async function DealsPage() {
    const deals = await getDeals();
    const companies = await getCompanies();
    return <DealsClient initialDeals={deals} companies={companies} />;
}
