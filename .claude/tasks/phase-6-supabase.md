# Phase 6: Supabase 연동

## Task 6.1: Supabase 프로젝트 설정

### 작업 내용
- [ ] Supabase 프로젝트 생성
- [ ] 환경 변수 설정 (.env.local)
- [ ] Supabase 클라이언트 설정

### 산출물
- `.env.local` (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- `src/datasources/supabase/client.ts`

### 코드
```typescript
// src/datasources/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## Task 6.2: 데이터베이스 마이그레이션

### 작업 내용
- [ ] profiles 테이블
- [ ] pages 테이블
- [ ] blocks 테이블
- [ ] properties 테이블
- [ ] property_values 테이블
- [ ] views 테이블
- [ ] 인덱스 생성

### 산출물
- `supabase/migrations/001_initial_schema.sql`

### 코드
```sql
-- supabase/migrations/001_initial_schema.sql
-- profiles
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- pages
create table pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  parent_id uuid references pages(id) on delete cascade,
  database_id uuid references pages(id) on delete cascade,
  title text not null default '',
  icon text,
  cover_image text,
  is_database boolean default false,
  archived boolean default false,
  position text not null default '0',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- blocks
create table blocks (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references pages(id) on delete cascade not null,
  parent_block_id uuid references blocks(id) on delete cascade,
  type text not null,
  content jsonb not null default '{}',
  position text not null default '0',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- properties
create table properties (
  id uuid primary key default gen_random_uuid(),
  database_id uuid references pages(id) on delete cascade not null,
  name text not null,
  type text not null,
  config jsonb default '{}',
  position text not null default '0'
);

-- property_values
create table property_values (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references pages(id) on delete cascade not null,
  property_id uuid references properties(id) on delete cascade not null,
  value jsonb,
  unique(page_id, property_id)
);

-- views
create table views (
  id uuid primary key default gen_random_uuid(),
  database_id uuid references pages(id) on delete cascade not null,
  name text not null,
  type text not null,
  config jsonb default '{}',
  position text not null default '0',
  created_at timestamptz default now()
);

-- 인덱스
create index pages_user_id_idx on pages(user_id);
create index pages_parent_id_idx on pages(parent_id);
create index blocks_page_id_idx on blocks(page_id);
```

---

## Task 6.3: RLS 정책 설정

### 작업 내용
- [ ] pages RLS
- [ ] blocks RLS
- [ ] properties RLS
- [ ] property_values RLS
- [ ] views RLS

### 산출물
- `supabase/migrations/002_rls_policies.sql`

---

## Task 6.4: Supabase Repository 구현

### 작업 내용
- [ ] SupabasePageRepository
- [ ] SupabaseBlockRepository
- [ ] SupabasePropertyRepository
- [ ] SupabaseViewRepository

### 산출물
- `src/repositories/implementations/supabase/SupabasePageRepository.ts`
- `src/repositories/implementations/supabase/SupabaseBlockRepository.ts`
- `src/repositories/implementations/supabase/SupabasePropertyRepository.ts`
- `src/repositories/implementations/supabase/SupabaseViewRepository.ts`

---

## Task 6.5: 환경별 Repository 전환

### 작업 내용
- [ ] VITE_USE_MSW 환경 변수
- [ ] repositories/index.ts 업데이트

### 산출물
- `src/repositories/index.ts` 수정

### 코드
```typescript
// src/repositories/index.ts
const useMock = import.meta.env.VITE_USE_MSW === 'true'

export const pageRepository = useMock
  ? new MockPageRepository()
  : new SupabasePageRepository(supabase)
```

---

## Task 6.6: Supabase Auth 연동

### 작업 내용
- [ ] Supabase Auth 설정 (Google, GitHub)
- [ ] SupabaseAuthRepository
- [ ] useAuth 훅 업데이트

### 산출물
- `src/features/auth/api/supabaseAuth.ts`

---

## Task 6.7: Realtime 구독 (선택)

### 작업 내용
- [ ] Supabase Realtime 구독
- [ ] Query Cache 동기화

### 산출물
- `src/features/blocks/hooks/useBlocksRealtime.ts`
