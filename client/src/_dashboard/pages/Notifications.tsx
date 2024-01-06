import { Header } from "@/components/dashboard/header";
import { Shell } from "@/components/dashboard/shell";
import { NotificationsForm } from "../forms/notifications-form";
import { Separator } from "@/components/ui/separator";

export default function DashboardNotifications() {
  return (
    <Shell>
      <Header
        title="Notifications"
        description="Configure how you receive notifications."
      />
      <div className="grid gap-10">
        <Separator />
        <NotificationsForm />
      </div>
    </Shell>
  );
}
