import { useState } from 'react';
import PropTypes from 'prop-types';
import * as api from '../api';

function ClientsSection({ clients, onChange }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.createClient({ name, email: email || undefined });
      setName('');
      setEmail('');
      onChange();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this client?')) return;
    try {
      await api.deleteClient(id);
      onChange();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <section className="panel">
      <h2>Clients</h2>
      <form className="inline-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Client name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={submitting}>
          Add Client
        </button>
      </form>
      {error && <p className="form-error">{error}</p>}

      {clients.length === 0 ? (
        <p className="empty-state">No clients yet — add one above.</p>
      ) : (
        <ul className="item-list">
          {clients.map((client) => (
            <li key={client.id} className="item-row">
              <div>
                <strong>{client.name}</strong>
                {client.email && <span className="muted"> — {client.email}</span>}
              </div>
              <button className="btn-danger" onClick={() => handleDelete(client.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

ClientsSection.propTypes = {
  clients: PropTypes.arrayOf(PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
})).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ClientsSection;
