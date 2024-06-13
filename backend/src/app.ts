import express from 'express';
import path from 'path';
import cors from 'cors';
import { corsOptions } from './configs/corsOptions';
import dotenv from 'dotenv';
import passport from './configs/passport';
import filesRoutes from './routes/files';
import authRoutes from './routes/auth';
import settingsRoutes from './routes/settings';

dotenv.config({ path: '../.env' });

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use('/auth', authRoutes);
app.use('/settings', settingsRoutes);
app.use('/files', filesRoutes);

app.use(
  express.static(path.join(__dirname.split('backend')[0], 'frontend', 'build')),
);

app.get('*', (req, res) => {
  res.sendFile(
    path.join(__dirname.split('backend')[0], 'frontend', 'build', 'index.html'),
  );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
