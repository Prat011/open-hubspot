import { getCompanies } from '@/app/actions';
import CompaniesClient from './client';

export default async function CompaniesPage() {
    const companies = await getCompanies();
    return <CompaniesClient initialCompanies={companies} />;
}
