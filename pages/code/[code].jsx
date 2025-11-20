import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function CodeStatsPage() {
  const router = useRouter();
  const { code } = router.query;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch stats for this code
  useEffect(() => {
    if (!code) return;

    async function load() {
      setLoading(true);
      try {
        const r = await fetch(`/api/links/${code}`);
        const json = await r.json();
        setData(json);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [code]);

  if (loading) {
    return <p className="p-6">Loading…</p>;
  }

  // If not found
  if (!data || data.error) {
    return (
      <div className="p-6 text-red-600 text-lg">
        Error: {data?.error || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        Stats for <span className="text-blue-600">{data.code}</span>
      </h1>

      <div className="space-y-3 border p-5 rounded bg-gray-50">
        <p>
          <strong>Target URL: </strong>
          <a
            href={data.target}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline break-all"
          >
            {data.target}
          </a>
        </p>

        <p>
          <strong>Total Clicks:</strong> {data.total_clicks}
        </p>

        <p>
          <strong>Last Clicked:</strong>{" "}
          {data.last_clicked
            ? new Date(data.last_clicked).toLocaleString()
            : "-"}
        </p>

        <p>
          <strong>Created At:</strong>{" "}
          {new Date(data.created_at).toLocaleString()}
        </p>
      </div>

      <Link href="/">
        <a className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Back to Dashboard
        </a>
      </Link>
    </div>
  );
}
