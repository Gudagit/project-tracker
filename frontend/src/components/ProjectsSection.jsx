import { useState } from 'react';
import PropTypes from 'prop-types';
import * as api from '../api';

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Done'];

function ProjectsSection({ projects, clients, onChange }) {
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !clientId) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.createProject({
        title,
        clientId: Number(clientId),
        deadline: deadline || undefined,
      });
      setTitle('');
      setDeadline('');
      onChange();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(project, status) {
    try {
      await api.updateProject(project.id, { status });
      onChange();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleTogglePaid(project) {
    try {
      await api.updateProject(project.id, { isPaid: !project.isPaid });
      onChange();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this project?')) return;
    try {
      await api.deleteProject(id);
      onChange();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <section className="panel">
      <h2>Projects</h2>
      <form className="inline-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Project title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select value={clientId} onChange={(e) => setClientId(e.target.value)} required>
          <option value="">Select client...</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        <button type="submit" disabled={submitting || clients.length === 0}>
          Add Project
        </button>
      </form>
      {clients.length === 0 && (
        <p className="hint">Add a client first before creating a project.</p>
      )}
      {error && <p className="form-error">{error}</p>}

      {projects.length === 0 ? (
        <p className="empty-state">No projects yet.</p>
      ) : (
        <ul className="item-list">
          {projects.map((project) => (
            <li key={project.id} className="item-row project-row">
              <div className="project-info">
                <strong>{project.title}</strong>
                <span className="muted"> — {project.client?.name}</span>
                {project.deadline && (
                  <span className="muted">
                    {' '}
                    — due {new Date(project.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="project-actions">
                <select
                  value={project.status}
                  onChange={(e) => handleStatusChange(project, e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <label className="paid-label">
                  <input
                    type="checkbox"
                    checked={project.isPaid}
                    onChange={() => handleTogglePaid(project)}
                  />
                  Paid
                </label>
                <button className="btn-danger" onClick={() => handleDelete(project.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const clientShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
});

ProjectsSection.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      deadline: PropTypes.string,
      isPaid: PropTypes.bool.isRequired,
      client: clientShape,
    })
  ).isRequired,
  clients: PropTypes.arrayOf(clientShape).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ProjectsSection;
