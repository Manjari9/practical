const app = require('./.js');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Todo API server is running on http://localhost:${PORT}`);
});
