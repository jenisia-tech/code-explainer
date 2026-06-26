"use client";

import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  async function explainCode() {
    setLoading(true);
    setExplanation("");

    const res = await fetch("/api/explain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();

    if (data.explanation) {
      setExplanation(data.explanation);
    } else {
      setExplanation(data.error || "Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">AI Code Explainer</h1>
        <p className="text-gray-300 mb-6">
          Paste your code below and click Explain.
        </p>

        <textarea
          className="w-full h-64 p-4 rounded-lg bg-gray-900 border border-gray-700 text-white"
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          onClick={explainCode}
          disabled={loading || !code}
          className="mt-4 px-6 py-3 bg-blue-600 rounded-lg font-semibold disabled:bg-gray-600"
        >
          {loading ? "Explaining..." : "Explain Code"}
        </button>

        {explanation && (
          <div className="mt-6 p-4 bg-gray-900 border border-gray-700 rounded-lg whitespace-pre-wrap">
            {explanation}
          </div>
        )}
      </div>
    </main>
  );
}