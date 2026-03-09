import { useState } from "react";

const LANGUAGES = [
  "French",
  "Spanish",
  "German",
  "Italian",
  "Portuguese",
  "Hindi",
  "Japanese",
  "Korean",
  "Chinese"
];

function App() {
  const [text, setText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("French");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("Model ready.");
  const [isLoading, setIsLoading] = useState(false);

  async function handleTranslate() {
    const trimmed = text.trim();
    if (!trimmed) {
      setStatus("Please enter text to translate.");
      setResult("");
      return;
    }

    setIsLoading(true);
    setStatus("Translating with Gemini…");

    try {
      const response = await fetch("http://localhost:8000/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, target_language: targetLanguage })
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          (data && data.detail) || "Translation failed. Please try again.";
        setStatus(message);
        setResult("");
        return;
      }

      setResult(data.result);
      setStatus("Translation ready.");
    } catch (error) {
      console.error(error);
      setStatus("Network error. Check that the API is running on port 8000.");
      setResult("");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page">
      <main className="shell">
        <header className="window-header">
          <div className="traffic-lights">
            <div className="dot red" />
            <div className="dot amber" />
            <div className="dot green" />
          </div>
          <div className="title">
            <span className="chip">React</span>
            <strong>AI Translator</strong>
            <span className="chip">FastAPI · gemini-2.5-flash</span>
          </div>
          <div style={{ width: 40 }} />
        </header>

        <section className="grid">
          <section className="panel" aria-label="Input">
            <div className="panel-header">
              <h2 className="panel-title">Source text</h2>
              <span className="badge">Browser → FastAPI → Gemini</span>
            </div>

            <label htmlFor="text">What would you like to translate?</label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a word, phrase, or sentence…"
            />
            <p className="hint">
              Uses the same translation logic as your Python CLI app, behind a
              FastAPI endpoint.
            </p>

            <div className="row">
              <div>
                <label htmlFor="language">Target language</label>
                <select
                  id="language"
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleTranslate}
                disabled={isLoading}
              >
                <span className="dot" />
                <span>{isLoading ? "Translating…" : "Translate"}</span>
              </button>
            </div>

            <p className="status">{status}</p>
          </section>

          <section className="panel" aria-label="Output">
            <div className="panel-header">
              <h2 className="panel-title">Translation</h2>
            </div>
            <div className="output">
              {result ? (
                result
              ) : (
                <div className="output-placeholder">
                  Your translation will appear here.
                </div>
              )}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;

