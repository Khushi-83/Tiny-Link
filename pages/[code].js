import { query } from "../lib/db";

export async function getServerSideProps({ params, res }) {
  const code = params.code;

  const data = await query("SELECT target FROM links WHERE code=$1", [code]);

  if (data.rowCount === 0) {
    res.statusCode = 404;
    return { props: {} };
  }

  const target = data.rows[0].target;

  await query(
    "UPDATE links SET total_clicks = total_clicks + 1, last_clicked = NOW() WHERE code=$1",
    [code]
  );

  return {
    redirect: {
      destination: target,
      permanent: false,
    },
  };
}

export default function RedirectPage() {
  return <div>Redirecting…</div>;
}
