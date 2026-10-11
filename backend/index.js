require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

const app = express();
// Comma-separated list of allowed origins, e.g. https://my-app.vercel.app
// Left empty (local dev), every origin is allowed.
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : true;
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const STATUSES = ['Not Started', 'In Progress', 'Done'];
const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;
const badRequest = (res, message) => res.status(400).json({ error: message });

app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/clients', async (req, res) => {
  const clients = await prisma.client.findMany();
  res.json(clients);
});

app.post('/clients', async (req, res) => {
  const { name, email } = req.body;
  if (!isNonEmptyString(name)) return badRequest(res, 'Name is required');
  const client = await prisma.client.create({
    data: { name, email },
  });
  res.status(201).json(client);
});

app.put('/clients/:id', async (req, res) => {
  const { name, email } = req.body;
  if (name !== undefined && !isNonEmptyString(name)) return badRequest(res, 'Name cannot be empty');
  const client = await prisma.client.update({
    where: { id: Number(req.params.id) },
    data: { name, email },
  });
  res.json(client);
});

app.delete('/clients/:id', async (req, res) => {
  const id = Number(req.params.id);
  // Checked explicitly: Prisma doesn't map Postgres's RESTRICT violation to a known error code.
  const projectCount = await prisma.project.count({ where: { clientId: id } });
  if (projectCount > 0) {
    return res
      .status(409)
      .json({ error: 'Cannot delete this client while it still has projects' });
  }
  await prisma.client.delete({ where: { id } });
  res.status(204).send();
});

app.get('/projects', async (req, res) => {
  const projects = await prisma.project.findMany({
    include: { client: true },
  });
  res.json(projects);
});

app.post('/projects', async (req, res) => {
  const { title, clientId, status, deadline, isPaid } = req.body;
  if (!isNonEmptyString(title)) return badRequest(res, 'Title is required');
  if (!Number.isInteger(Number(clientId))) return badRequest(res, 'A valid clientId is required');
  if (status !== undefined && !STATUSES.includes(status)) return badRequest(res, 'Invalid status');
  const project = await prisma.project.create({
    data: {
      title,
      clientId: Number(clientId),
      status,
      deadline: deadline ? new Date(deadline) : undefined,
      isPaid,
    },
  });
  res.status(201).json(project);
});

app.put('/projects/:id', async (req, res) => {
  const { title, status, deadline, isPaid } = req.body;
  if (title !== undefined && !isNonEmptyString(title)) return badRequest(res, 'Title cannot be empty');
  if (status !== undefined && !STATUSES.includes(status)) return badRequest(res, 'Invalid status');
  const project = await prisma.project.update({
    where: { id: Number(req.params.id) },
    data: {
      title,
      status,
      deadline: deadline ? new Date(deadline) : undefined,
      isPaid,
    },
  });
  res.json(project);
});

app.delete('/projects/:id', async (req, res) => {
  await prisma.project.delete({
    where: { id: Number(req.params.id) },
  });
  res.status(204).send();
});

// Central error handler (Express 5 forwards async errors here automatically),
// so failed requests return JSON instead of Express's default HTML page.
// Prisma error codes are mapped to meaningful HTTP statuses.
app.use((err, req, res, next) => {
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
