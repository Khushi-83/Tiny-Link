import { useState, useEffect } from "react";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Load all links
  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/links");
      const data = await r.json();
      setLinks(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Create new link
  async function createLink(e) {
    e.preventDefault();
    setError("");

    const r = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target,
        code: code || undefined, // if empty send undefined
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      setError(data.error);
    } else {
      setTarget("");
      setCode("");
      load();
    }
  }

  // Delete link
  async function deleteLink(code) {
    if (!confirm(`Delete ${code}?`)) return;

    await fetch(`/api/links/${code}`, { method: "DELETE" });
    load();
  }

  // Copy short URL
  function copyLink(code) {
    const shortUrl = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(shortUrl);
    alert("Copied!");
  }

  const filtered = links.filter(
    (l) =>
      l.code.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <header>
        <h1 className="text-3xl font-bold">TinyLink Dashboard</h1>
        <p className="text-gray-600">
          Create and manage short links easily.
        </p>
      </header>

      {/* Create Link Form */}
      <form
        onSubmit={createLink}
        className="border rounded p-5 space-y-4 bg-gray-50"
      >
        <div>
          <label className="block mb-1 font-medium">Target URL</label>
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="https://example.com/very/long/url"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Custom Code (optional)
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="6–8 alphanumeric characters"
            className="w-full p-2 border rounded"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Create Short Link
        </button>
      </form>

      {/* Search */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Links</h2>
        <input
          type="text"
          placeholder="Search by code or URL"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-64"
        />
      </div>

      {/* Links Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mt-2">
            <thead>
              <tr className="bg-gray-100 border-b text-left">
                <th className="p-3">Code</th>
                <th className="p-3">Target URL</th>
                <th className="p-3">Clicks</th>
                <th className="p-3">Last Clicked</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-4 text-center text-gray-600"
                  >
                    No links found
                  </td>
                </tr>
              )}

              {filtered.map((link) => (
                <tr key={link.code} className="border-b">
                  <td className="p-3 font-mono">{link.code}</td>
                  <td className="p-3 max-w-xs truncate">
                    <a
                      href={link.target}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      {link.target}
                    </a>
                  </td>
                  <td className="p-3">{link.total_clicks}</td>
                  <td className="p-3">
                    {link.last_clicked
                      ? new Date(link.last_clicked).toLocaleString()
                      : "-"}
                  </td>
                  <td className="p-3 space-x-3">
                    <button
                      onClick={() => copyLink(link.code)}
                      className="px-2 py-1 border rounded"
                    >
                      Copy
                    </button>

                    <a
                      href={`/code/${link.code}`}
                      className="px-2 py-1 border rounded"
                    >
                      Stats
                    </a>

                    <button
                      onClick={() => deleteLink(link.code)}
                      className="px-2 py-1 border rounded text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
