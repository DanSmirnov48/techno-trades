import { Header } from "@/components/dashboard/header";
import { Shell } from "@/components/dashboard/shell";
import { AppearanceForm } from "../forms/appearance-form";
import { Separator } from "@/components/ui/separator";

export default function DashboardAppearance() {
  return (
    <Shell>
      <Header
        title="Appearance"
        description="Customize the appearance of the app. Automatically switch between day
        and night themes."
        size="default"
      />
      <div className="grid gap-10">
        <Separator />
        <AppearanceForm />
      </div>
    </Shell>
  );
}
