const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const exampleRoutes = require('./routes/exampleRoutes');
const { connectDB } = require('./config/db');

dotenv.config({ path: './.env' });

// 환경 변수를 출력하여 확인합니다.
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/example', exampleRoutes);

app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running', db: 'Connected' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
