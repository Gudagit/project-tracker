const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data;
}

export const getClients = () => request('/clients');
export const createClient = (data) =>
  request('/clients', { method: 'POST', body: JSON.stringify(data) });
export const deleteClient = (id) =>
  request(`/clients/${id}`, { method: 'DELETE' });

export const getProjects = () => request('/projects');
export const createProject = (data) =>
  request('/projects', { method: 'POST', body: JSON.stringify(data) });
export const updateProject = (id, data) =>
  request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteProject = (id) =>
  request(`/projects/${id}`, { method: 'DELETE' });
