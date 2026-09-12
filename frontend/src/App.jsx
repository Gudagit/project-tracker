import { useEffect, useState } from 'react';
import * as api from './api';
import ClientsSection from './components/ClientsSection';
import ProjectsSection from './components/ProjectsSection';
import './App.css';

function App() {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadAll() {
    try {
      const [clientsData, projectsData] = await Promise.all([
        api.getClients(),
        api.getProjects(),
      ]);
      setClients(clientsData);
      setProjects(projectsData);
      setError(null);
    } catch (err) {
      setError('Could not reach the server. Is the backend running on port 3000?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Client &amp; Project Tracker</h1>
        <p className="subtitle">Manage your clients and their projects</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <main className="app-main">
          <ClientsSection clients={clients} onChange={loadAll} />
          <ProjectsSection projects={projects} clients={clients} onChange={loadAll} />
        </main>
      )}
    </div>
  );
}

export default App;
