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
        code: code || undefined,
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
  <div className="container">
    
    <h1>TinyLink Dashboard</h1>
    <p className="subtitle">Create, manage, and analyze your short links.</p>
    <p><strong>Total Links:</strong> {links.length}</p>

    {/* Create Form */}
    <div className="card">
      <h2>Create a New Short Link</h2>

      <form onSubmit={createLink}>
        <label>Target URL</label>
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="https://example.com/long/url"
          required
        />

        <label>Custom Code (optional)</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="6–8 letters or numbers"
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Create Short Link</button>
      </form>
    </div>

    {/* Search */}
    <div className="search-row">
      <h2>All Links</h2>

      <input
        type="text"
        placeholder="Search by code or URL"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />
    </div>

    {/* Table */}
    <div className="table-wrapper">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Target URL</th>
              <th>Clicks</th>
              <th>Last Clicked</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  No links found
                </td>
              </tr>
            ) : (
              filtered.map((link) => (
                <tr key={link.code}>
                  <td>{link.code}</td>

                  <td>
                    <a href={link.target} target="_blank" rel="noopener noreferrer">
                      {link.target}
                    </a>
                  </td>

                  <td>{link.total_clicks}</td>

                  <td>
                    {link.last_clicked
                      ? new Date(link.last_clicked).toLocaleString()
                      : "-"}
                  </td>

                  <td>
                    <div className="actions">
                      <button onClick={() => copyLink(link.code)}>Copy</button>

                      <a href={`/code/${link.code}`}>Stats</a>

                      <button
                        className="delete"
                        onClick={() => deleteLink(link.code)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>

  </div>
);
}