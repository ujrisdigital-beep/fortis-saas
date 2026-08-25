"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "../../../../components/navbar";
import { Footer } from "../../../../components/footer";
import { GRANT_WATCHLIST, outlineGrantDraft } from "../../../../lib/tools/models";

export default function GrantApplyPage() {
  const params = useParams<{ grantId: string }>();
  const grant = useMemo(() => GRANT_WATCHLIST.find((g) => g.id === params.grantId), [params.grantId]);
  const [org, setOrg] = useState("");
  const [project, setProject] = useState("");
  const [outline, setOutline] = useState("");

  if (!grant) {
    return (
      <>
        <Navbar />
        <main style={{ padding: "3rem 1rem" }}>
          <p>Unknown watchlist item.</p>
          <Link href="/funding">Back</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
        <Link href="/funding">← Watchlist</Link>
        <h1>Outline only — {grant.title}</h1>
        <p>
          This is a local template. It is <strong>not</strong> submitted to {grant.funder}, not AI-filed,
          and not an official application. Confirm the live call on{" "}
          <a href={grant.url} target="_blank" rel="noreferrer">
            the funder site
          </a>
          .
        </p>
        <label>
          Organisation
          <input value={org} onChange={(e) => setOrg(e.target.value)} style={{ display: "block", width: "100%" }} />
        </label>
        <label>
          Project in one paragraph
          <textarea value={project} onChange={(e) => setProject(e.target.value)} rows={5} style={{ display: "block", width: "100%" }} />
        </label>
        <button
          type="button"
          onClick={() => setOutline(outlineGrantDraft({ funder: grant.funder, org, project }))}
        >
          Build outline
        </button>
        {outline && <pre style={{ whiteSpace: "pre-wrap" }}>{outline}</pre>}
      </main>
      <Footer />
    </>
  );
}
