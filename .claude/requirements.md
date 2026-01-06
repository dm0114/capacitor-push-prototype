# Arkilo - 플래닝 앱 요구사항

## 개요

노션 스타일의 플래닝/스케줄링 앱 (웹 + iOS/Android)

## MVP 범위

- 페이지 시스템 (중첩 페이지)
- 블록 에디터 (노션 스타일)
- 데이터베이스 뷰 (테이블, 칸반, 캘린더)
- 인증 (소셜 로그인)
- 오프라인 지원

## 기술 스택

상세 내용은 [ADR-001: 기술 스택](./adr/ADR-001-tech-stack.md) 참조

| 레이어 | 선택 |
|--------|------|
| Framework | React 19 |
| 크로스플랫폼 | Capacitor |
| UI | shadcn/ui + Tailwind 4 |
| 라우팅 | TanStack Router |
| 상태 관리 | Zustand + TanStack Query |
| DnD | dnd-kit |
| 블록 에디터 | BlockNote |
| 테이블 | TanStack Table |
| 캘린더 | Schedule-X |
| 백엔드 | MSW (개발) → Supabase (프로덕션) |

## 비기능 요구사항

- **오프라인 우선**: 네트워크 없이도 사용 가능
- **반응형**: 웹 기준 개발, 모바일 자동 적용
- **8px 그리드**: 일관된 디자인 시스템
- **확장성**: Ionic/Electron 데스크톱 앱 확장 대비

## 관련 문서

- [아키텍처 개요](./architecture/README.md)
- [폴더 구조](./architecture/folder-structure.md)
- [데이터 모델](./architecture/data-model.md)
- [상태 관리 흐름](./architecture/state-flow.md)
- [ADR 목록](./adr/)
