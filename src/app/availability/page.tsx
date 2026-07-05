import { PageHeader } from "@/components/layout/PageHeader";

export default function AvailabilityPage() {
  return (
    <>
      <PageHeader
        title="Availability"
        description="Manage weekly player availability."
      />

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm text-slate-400">
          Availability editor will be added later.
        </p>
      </div>
    </>
  );
}