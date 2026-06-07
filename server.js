const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  // HTML 페이지 제공
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    const html = `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Project2 대시보드</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 0 16px; background: #fafafa; color: #222; }
          h1 { color: #333; }
          h2 { font-size: 1.1rem; color: #444; }
          .card { border: 1px solid #ddd; padding: 20px; margin: 16px 0; border-radius: 8px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
          .api-btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 5px; font-size: 0.9rem; transition: background 0.15s; }
          .api-btn:hover { background: #0056b3; }
          .result { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 4px; }
          pre { overflow-x: auto; margin: 0; }
          .status-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #28a745; margin-right: 6px; vertical-align: middle; }
          .badge { display: inline-block; background: #e9f5ff; color: #0056b3; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; }
        </style>
      </head>
      <body>
        <h1>📊 Project2 대시보드 <span class="badge">v1.1.0</span></h1>

        <div class="card">
          <h2>서버 정보</h2>
          <p>호스트: localhost:3001</p>
          <p><span class="status-dot"></span>상태: <span id="health-status">확인 중...</span></p>
        </div>

        <div class="card">
          <h2>API 테스트</h2>
          <button class="api-btn" onclick="fetchAPI('/api/dashboard')">Dashboard</button>
          <button class="api-btn" onclick="fetchAPI('/api/stats')">통계</button>
          <button class="api-btn" onclick="fetchAPI('/api/config')">설정</button>
          <button class="api-btn" onclick="fetchAPI('/api/users')">사용자</button>
          <button class="api-btn" onclick="fetchAPI('/api/health')">헬스체크</button>
          <div class="result" id="result">결과가 여기 표시됩니다</div>
        </div>

        <div class="card">
          <h2>시스템 정보</h2>
          <button class="api-btn" onclick="fetchAPI('/api/system')">시스템 정보</button>
          <div class="result" id="system">결과가 여기 표시됩니다</div>
        </div>

        <script>
          function fetchAPI(url) {
            fetch(url)
              .then(response => response.json())
              .then(data => {
                const resultDiv = url.includes('system') ? document.getElementById('system') : document.getElementById('result');
                resultDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
              })
              .catch(error => {
                const resultDiv = url.includes('system') ? document.getElementById('system') : document.getElementById('result');
                resultDiv.innerHTML = '<p style="color: red;">오류: ' + error.message + '</p>';
              });
          }

          // 헬스 상태 표시
          function updateHealth() {
            fetch('/api/health')
              .then(response => response.json())
              .then(data => {
                document.getElementById('health-status').textContent =
                  '🟢 실행 중 (uptime: ' + data.uptime + 's)';
              })
              .catch(() => {
                document.getElementById('health-status').textContent = '🔴 응답 없음';
              });
          }

          // 페이지 로드 시 Dashboard 자동 로드 + 헬스 확인
          window.onload = () => {
            fetchAPI('/api/dashboard');
            updateHealth();
          };
        </script>
      </body>
      </html>
    `;
    res.end(html);
  }
  
  // API: 대시보드
  else if (req.url === "/api/dashboard" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      title: "Project2 대시보드",
      version: "1.1.0",
      status: "활성화",
      lastUpdate: new Date().toISOString()
    }));
  }

  // API: 통계
  else if (req.url === "/api/stats" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      users: 45,
      projects: 12,
      tasks: 234,
      completed: 189
    }));
  }

  // API: 설정
  else if (req.url === "/api/config" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      appName: "Project2",
      version: "1.1.0",
      environment: "development",
      port: 3001,
      debug: true
    }));
  }

  // API: 헬스체크
  else if (req.url === "/api/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      status: "healthy",
      version: "1.1.0",
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    }));
  }

  // API: 사용자 목록
  else if (req.url === "/api/users" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      total: 3,
      users: [
        { id: 1, name: "김철수", role: "admin", active: true },
        { id: 2, name: "이영희", role: "editor", active: true },
        { id: 3, name: "박민수", role: "viewer", active: false }
      ]
    }));
  }

  // API: 시스템 정보
  else if (req.url === "/api/system" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    const os = require("os");
    res.end(JSON.stringify({
      platform: os.platform(),
      architecture: os.arch(),
      nodeVersion: process.version,
      uptime: Math.floor(process.uptime()),
      memory: {
        total: Math.floor(os.totalmem() / 1024 / 1024) + " MB",
        free: Math.floor(os.freemem() / 1024 / 1024) + " MB",
        used: Math.floor((os.totalmem() - os.freemem()) / 1024 / 1024) + " MB"
      },
      cpus: os.cpus().length
    }));
  }

  // 404
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Project2 Server running on http://localhost:${PORT}`);
  console.log(`브라우저에서 http://localhost:${PORT} 를 열어주세요`);
});