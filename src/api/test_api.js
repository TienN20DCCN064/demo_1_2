const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let users = [
  { id: 1, firstName: 'Peter', lastName: 'Mackenzie' },
  { id: 2, firstName: 'Cindy', lastName: 'Zhang' },
  { id: 3, firstName: 'Ted', lastName: 'Smith' },
  { id: 4, firstName: 'Susan', lastName: 'Fernbrook' },
  { id: 5, firstName: 'Emily', lastName: 'Kim' },
  { id: 6, firstName: 'Peter', lastName: 'Zhang' },
  { id: 7, firstName: 'Cindy', lastName: 'Smith' },
  { id: 8, firstName: 'Ted', lastName: 'Fernbrook' },
  { id: 9, firstName: 'Susan', lastName: 'Kim' },
  { id: 10, firstName: 'Emily', lastName: 'Mackenzie' }
];

// Lấy toàn bộ users
app.get('/api/users', (req, res) => {
  res.json({
    data: users,
    offset: 0,
    limit: users.length,
    total: users.length
  });
});

// Lấy 1 user theo id
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Thêm user
app.post('/api/users', (req, res) => {
  const { firstName, lastName } = req.body;
  const newUser = {
    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
    firstName,
    lastName
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Cập nhật user
app.put('/api/users/:id', (req, res) => {
  const { firstName, lastName } = req.body;
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.firstName = firstName ?? user.firstName;
  user.lastName = lastName ?? user.lastName;

  res.json(user);
});

// Xoá user
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  const deletedUser = users.splice(index, 1);
  res.json(deletedUser[0]);
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
