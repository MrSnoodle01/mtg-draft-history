import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>MTG Draft Tracker</h1>
        <p>Track drafts, matchups, and friend stats</p>
      </header>

      <main className="main">
        <section className="card">
          <h2>Recent Drafts</h2>
          <p className="muted">No drafts yet — add your first one.</p>
          <button className="button">+ New Draft</button>
        </section>

        <section className="grid">
          <div className="card">
            <h3>Players</h3>
            <p className="muted">Track win rates and placements</p>
          </div>

          <div className="card">
            <h3>Matchups</h3>
            <p className="muted">See peer vs peer history</p>
          </div>

          <div className="card">
            <h3>Stats</h3>
            <p className="muted">Color win rates, archetypes, etc.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;