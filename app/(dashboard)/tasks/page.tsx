import { getTasks, getContacts, getCompanies } from '@/app/actions';
import TasksClient from './client';

export default async function TasksPage() {
    const tasks = await getTasks();
    const contacts = await getContacts();
    const companies = await getCompanies();
    return <TasksClient initialTasks={tasks} contacts={contacts} companies={companies} />;
}
