const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  
  if (req.url === "/") {
    res.end(JSON.stringify({ 
      message: "Hello from Project1 v1.1.0",
      timestamp: new Date().toISOString(),
      version: "1.1.0"
    }));
  } else if (req.url === "/api/status") {
    res.end(JSON.stringify({ status: "running", uptime: process.uptime() }));
  } else if (req.url === "/api/info") {
    res.end(JSON.stringify({ app: "Project1", env: "production", version: "1.1.0" }));
  } else if (req.url === "/api/health") {
    res.end(JSON.stringify({ health: "healthy", timestamp: new Date().toISOString() }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
