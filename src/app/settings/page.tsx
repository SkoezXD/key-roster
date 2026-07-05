import { PageHeader } from "@/components/layout/PageHeader";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage team and application settings."
      />

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm text-slate-400">
          Settings content will be added later.
        </p>
      </div>
    </>
  );
}