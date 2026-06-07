# Project2 대시보드

순수 Node.js `http` 모듈로 구현한 간단한 대시보드 서버입니다. 외부 의존성이 없습니다.

## 실행 방법

```bash
npm start
```

서버가 실행되면 브라우저에서 [http://localhost:3001](http://localhost:3001) 을 열어 대시보드를 확인하세요.

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/` | 대시보드 HTML 페이지 |
| GET | `/api/dashboard` | 대시보드 기본 정보 (title, version, status) |
| GET | `/api/stats` | 사용자·프로젝트·작업 통계 |
| GET | `/api/config` | 앱 설정 정보 |
| GET | `/api/users` | 사용자 목록 |
| GET | `/api/health` | 헬스체크 (status, version, uptime, timestamp) |
| GET | `/api/system` | 시스템 정보 (플랫폼, 메모리, CPU 등) |

## 요구 사항

- Node.js (LTS 권장)

## 버전

현재 버전: **1.1.0**
