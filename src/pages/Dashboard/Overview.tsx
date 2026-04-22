const Overview = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Welcome back to your dashboard.
        </p>
      </div>

      {/* Stat cards placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {["Projects", "Events", "Members"].map((label) => (
          <div
            key={label}
            className="bg-[#1A2235] border border-[#2A3550] rounded-xl p-5"
          >
            <p className="text-xs text-zinc-500 uppercase tracking-widest">
              {label}
            </p>
            <p className="text-3xl font-bold text-white mt-2">—</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
