import { getTeamMembers } from '@/app/actions';
import TeamClient from './client';

export default async function TeamPage() {
    const { members, invitations } = await getTeamMembers();
    return <TeamClient members={members} invitations={invitations} />;
}
