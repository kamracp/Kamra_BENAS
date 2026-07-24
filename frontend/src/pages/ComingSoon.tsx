type ComingSoonProps = {
  title: string;
};

export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="rounded-xl border bg-white p-10 shadow-sm">

      <div className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
        Coming Soon
      </div>

      <h1 className="mt-6 text-4xl font-bold text-slate-800">
        {title}
      </h1>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
        This enterprise module is currently under development and will be
        released as part of the Kamra ClimateOS platform.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

        <div className="rounded-lg border p-5">
          Engineering Calculations
        </div>

        <div className="rounded-lg border p-5">
          Enterprise Analytics
        </div>

        <div className="rounded-lg border p-5">
          REST APIs
        </div>

        <div className="rounded-lg border p-5">
          Reporting
        </div>

        <div className="rounded-lg border p-5">
          AI Recommendations
        </div>

        <div className="rounded-lg border p-5">
          Benchmarking
        </div>

      </div>

    </div>
  );
}