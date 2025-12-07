import { getContacts, getCompanies } from '@/app/actions';
import ContactsClient from './client';

export default async function ContactsPage() {
    const contacts = await getContacts();
    const companies = await getCompanies();
    return <ContactsClient initialContacts={contacts} companies={companies} />;
}
