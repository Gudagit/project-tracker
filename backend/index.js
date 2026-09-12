require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/clients', async (req, res) => {
  const clients = await prisma.client.findMany();
  res.json(clients);
});

app.post('/clients', async (req, res) => {
  const { name, email } = req.body;
  const client = await prisma.client.create({
    data: { name, email },
  });
  res.status(201).json(client);
});

app.put('/clients/:id', async (req, res) => {
  const { name, email } = req.body;
  const client = await prisma.client.update({
    where: { id: Number(req.params.id) },
    data: { name, email },
  });
  res.json(client);
});

app.delete('/clients/:id', async (req, res) => {
  await prisma.client.delete({
    where: { id: Number(req.params.id) },
  });
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

// Runs whenever a route handler above throws or its promise rejects
// (Express 5 forwards async errors here automatically). Without this,
// a failed request (e.g. deleting a client that still has projects)
// would send back Express's default HTML error page instead of JSON.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
