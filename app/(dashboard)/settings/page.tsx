import { auth } from "@/auth";
import SettingsClient from "./client";

export default async function SettingsPage() {
    const session = await auth();
    return <SettingsClient user={session?.user} />;
}
