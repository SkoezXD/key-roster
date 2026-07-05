import { PageHeader } from "@/components/layout/PageHeader";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of roster, upcoming runs and team status."
      />

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm text-slate-400">
          Dashboard content will be added later.
        </p>
      </div>
    </>
  );
}