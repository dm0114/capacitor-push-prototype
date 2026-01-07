# Arkilo

노션 스타일의 플래닝/스케줄링 앱 (웹 + iOS/Android)

---

## 알림 시스템 아키텍처

### 플랫폼별 지원 현황

| 플랫폼 | 로컬 예약 알림 | 서버 푸시 |
|--------|--------------|----------|
| **iOS/Android** (Capacitor) | ✅ LocalNotifications | ✅ 가능 |
| **웹 (PWA)** | ❌ 불가능 | ✅ 서버 필요 |

### 웹(PWA)에서 로컬 예약이 불가능한 이유

- Service Worker가 언제든 종료될 수 있어서 타이머 기반 예약 불가
- Google이 Notification Triggers API를 개발하다 포기함
- **해결책**: 사용자가 시간 지정 → 서버 DB 저장 → 해당 시간에 서버가 푸시 전송
- 단, 알림 시점에 **인터넷 연결 필수**

### 현재 구현 상태

```
네이티브 (iOS/Android)
──────────────────────────────────
User → @capacitor/local-notifications → OS가 알림 예약
       (오프라인에서도 작동)


웹 (PWA) - 미구현
──────────────────────────────────
User → Supabase DB 저장 → Edge Function (cron/scheduler)
                              ↓
                         Web Push API / FCM
                              ↓
                         Service Worker → 알림 표시
```

### 비용 비교: 네이티브 앱 vs PWA

| 항목 | 네이티브 앱 | PWA |
|------|-----------|-----|
| Apple Developer | $99/년 | 무료 |
| 빌드/배포 | App Store 심사 필요 | 즉시 배포 |
| 푸시 서버 | 불필요 (로컬 알림) | 필요 (Supabase/FCM) |
| 오프라인 알림 | ✅ 가능 | ❌ 인터넷 필요 |
| 관리 포인트 | iOS/Android 각각 빌드 | 단일 웹 빌드 |

### 관련 파일

```
src/features/reminders/
├── lib/notifications.ts      # Capacitor LocalNotifications 래퍼
├── api/queries.ts            # 설정 저장 (localStorage)
└── components/
    ├── ReminderSettings.tsx  # 설정 UI
    └── ReminderHandler.tsx   # 알림 탭 핸들러
```

---

## 점진적 마이그레이션 전략 (권장)

```
[순수 PWA] → [Capacitor 래핑] → [네이티브 기능 추가]
```

**웹 코드 그대로 두고 Capacitor만 씌우면 끝.**

### Capacitor 도입 시 추가되는 것

- 로컬 알림 예약 (`@capacitor/local-notifications`)
- 앱스토어 배포 가능
- 네이티브 API 접근 (카메라, 파일시스템 등)

### 코드 변경 거의 없음

```typescript
// 웹에서도 동작, 네이티브에서도 동작
import { LocalNotifications } from '@capacitor/local-notifications';

await LocalNotifications.schedule({
  notifications: [{
    title: '알림',
    body: '예약된 알림',
    schedule: { at: new Date(Date.now() + 1000 * 60) }
  }]
});
```

Capacitor가 환경 감지해서 **웹이면 fallback, 네이티브면 OS API 호출**.

### 결론

> PWA로 검증 → 유저 생기면 Capacitor 씌워서 스토어 배포.
> **리스크 최소화하면서 확장 가능.**

---

## Capacitor 알림 패키지 비교

| 패키지 | 용도 |
|--------|------|
| `@capacitor/local-notifications` | 앱 내에서 예약/즉시 알림 |
| `@capacitor/push-notifications` | FCM/APNs에서 오는 서버 푸시 수신 |

### push-notifications 플로우

```
[너의 서버] → [FCM/APNs] → [OS] → [Capacitor 앱이 수신]
```

```typescript
import { PushNotifications } from '@capacitor/push-notifications';

// 토큰 받기 (서버에 저장해야 함)
PushNotifications.addListener('registration', token => {
  console.log(token.value); // 이걸 서버로 보냄
});

// 푸시 수신
PushNotifications.addListener('pushNotificationReceived', notification => {
  console.log(notification);
});

await PushNotifications.register();
```

### 언제 뭘 쓰냐

| 케이스 | 패키지 |
|--------|--------|
| "매일 오전 9시 알림" | `local-notifications` |
| "새 메시지 도착" (실시간) | `push-notifications` |
| "예약한 일정 30분 전" | 둘 다 가능 (로컬이 간단) |

- **서버 없이 특정 시간 알림** → `local`
- **서버에서 트리거** → `push`

---

# Getting Started

To run this application:

```bash
pnpm install
pnpm start
```

# Building For Production

To build this application for production:

```bash
pnpm build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
pnpm test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.



## Shadcn

Add components using the latest version of [Shadcn](https://ui.shadcn.com/).

```bash
pnpm dlx shadcn@latest add button
```



## Routing
This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).


## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...

const queryClient = new QueryClient();

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
});
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: () =>
      fetch("https://swapi.dev/api/people")
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
pnpm add @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}

export default App;
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store, Derived } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
