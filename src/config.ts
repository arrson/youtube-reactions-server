export default () => ({
  databaseUrl: process.env.DATABASE_URL,
  youtubeApiKey: process.env.YOUTUBE_API_KEY,
  port: parseInt(process.env.PORT, 10) || 3000,
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || 'fakeId',
    secret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fake_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '5d',
  },
});
