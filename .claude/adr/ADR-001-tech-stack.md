# ADR-001: 플래닝 앱 기술 스택 선정

**Status**: Accepted
**Date**: 2025-01-06
**Deciders**: dm0114

---

## Context

웹 + 모바일(iOS/Android) 플래닝/스케줄링 앱 개발. 노션 스타일의 미니멀 UI, 칸반보드/타임라인 등 DnD 인터랙션 필수. 소규모 팀(FE 2인)으로 단일 코드베이스 유지 필요.

## Decision

### Core Stack

| 레이어 | 선택 | 비고 |
|--------|------|------|
| Framework | **React 19** | Concurrent features, use() hook |
| 크로스플랫폼 | **Capacitor** | 웹 코드 그대로 모바일 래핑 |
| UI 컴포넌트 | **shadcn/ui** | Radix UI 기반, 100% 커스터마이징 |
| 스타일링 | **Tailwind CSS 4** | shadcn/ui 기본 스택 |
| 라우팅 | **TanStack Router** | 타입 안전, 파일 기반 |
| 상태 관리 | **Zustand + TanStack Query** | 클라이언트/서버 상태 분리 |
| 드래그앤드롭 | **dnd-kit** | 터치 내장, 모듈러 |

### Planning App Specific

| 기능 | 선택 | 비고 |
|------|------|------|
| 리치 텍스트 | **BlockNote** | 노션 스타일 블록 에디터 |
| 테이블/DB 뷰 | **TanStack Table** | 헤드리스, 가상화 |
| 캘린더 | **Schedule-X** | 모던, 커스터마이징 용이 |
| 터치 제스처 보완 | **@use-gesture/react** | 복잡한 제스처 |

### Backend & Data

| 기능 | 선택 | 비고 |
|------|------|------|
| 개발 모킹 | **MSW** | API 목업 |
| 프로덕션 | **Supabase** | Auth + Postgres + Realtime |
| 오프라인 | **IndexedDB** | TanStack Query 영속화 |

---

## Alternatives Considered

### UI 라이브러리

| 옵션 | 장점 | 탈락 사유 |
|------|------|----------|
| Ionic Framework | Capacitor 공식 통합 | iOS/Material 디자인 종속, 노션 스타일 오버라이드 과다 |
| Konsta UI | Tailwind 기반, 모바일 최적화 | 생태계 작음 (GitHub 2K) |
| Framework7 | 네이티브 룩 | 커뮤니티 축소 중 |

### DnD 라이브러리

| 옵션 | 장점 | 탈락 사유 |
|------|------|----------|
| react-beautiful-dnd | 칸반 구현 쉬움 | 2024.10 deprecated |
| @hello-pangea/dnd | rbd 포크 | dnd-kit 대비 번들 3배, 확장성 제한 |
| react-dnd | 유연함 | 터치 지원 별도 구현 필요 |

### 블록 에디터

| 옵션 | 장점 | 탈락 사유 |
|------|------|----------|
| Tiptap | 성숙함, 확장성 | 노션 스타일 블록 직접 구현 필요 |
| Slate | 저수준 제어 | 구현 비용 높음 |
| Editor.js | 블록 기반 | 커스터마이징 제한적 |

---

## Consequences

### Positive

- 단일 코드베이스로 웹/iOS/Android 커버
- shadcn/ui 코드 소유권으로 디자인 제약 없음
- dnd-kit 터치 센서 내장으로 모바일 DnD 즉시 동작
- BlockNote 노션 스타일 기본 제공
- Logseq/Obsidian에서 검증된 조합

### Negative

- shadcn/ui 네이티브 제스처 미지원 → @use-gesture 추가 필요
- Capacitor Safe Area/키보드 처리 별도 설정 필요
- Ionic 대비 네이티브 페이지 전환 애니메이션 직접 구현

### Risks

| 리스크 | 영향 | 완화 전략 |
|--------|------|----------|
| BlockNote 상대적 신규 | 중 | Tiptap 폴백 가능 (같은 ProseMirror 기반) |
| Schedule-X 2024년 출시 | 중 | FullCalendar 폴백, 추상화 레이어 |
| Tailwind 4 신규 | 낮 | Vite 플러그인 안정화됨 |

---

## References

- [shadcn/ui GitHub](https://github.com/shadcn-ui/ui) - 99.8K stars
- [dnd-kit Docs](https://docs.dndkit.com)
- [BlockNote](https://www.blocknotejs.org/)
- [react-beautiful-dnd Deprecation](https://github.com/atlassian/react-beautiful-dnd/issues/2672)
