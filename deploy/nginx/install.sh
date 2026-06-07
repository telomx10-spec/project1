#!/usr/bin/env bash
# project1 nginx 리버스 프록시 설치 스크립트 (root 권한 필요)
# 실행:  sudo bash /home/claude2/projects/project1/deploy/nginx/install.sh
set -euo pipefail

SRC="/home/claude2/projects/project1/deploy/nginx/project1.conf"
DST="/etc/nginx/conf.d/project1.conf"
MAIN="/etc/nginx/nginx.conf"
STAMP="$(date +%Y%m%d-%H%M%S)"

echo "==> 1) 설정 파일 복사: $DST"
cp "$SRC" "$DST"

echo "==> 2) 기본 nginx.conf 백업: ${MAIN}.bak-${STAMP}"
cp "$MAIN" "${MAIN}.bak-${STAMP}"

echo "==> 3) 기존 기본 server 블록의 default_server 제거 (충돌 방지)"
# 'listen 80 default_server;' / 'listen [::]:80 default_server;' 에서 default_server 만 제거
sed -i -E 's/(listen[[:space:]]+80)[[:space:]]+default_server;/\1;/' "$MAIN"
sed -i -E 's/(listen[[:space:]]+\[::\]:80)[[:space:]]+default_server;/\1;/' "$MAIN"

echo "==> 4) SELinux: nginx -> 백엔드 연결 허용"
if command -v setsebool >/dev/null 2>&1; then
  setsebool -P httpd_can_network_connect 1 || echo "   (setsebool 실패 - SELinux 미사용일 수 있음, 무시)"
fi

echo "==> 5) 방화벽: 80 포트 개방"
if command -v firewall-cmd >/dev/null 2>&1 && firewall-cmd --state >/dev/null 2>&1; then
  firewall-cmd --permanent --add-service=http
  firewall-cmd --reload
else
  echo "   (firewalld 비활성 - 건너뜀)"
fi

echo "==> 6) nginx 설정 문법 검사"
nginx -t

echo "==> 7) nginx 활성화 및 적용"
systemctl enable --now nginx
systemctl reload nginx

echo "==> 완료. 검증:"
echo "    curl -s http://127.0.0.1/api/health"
