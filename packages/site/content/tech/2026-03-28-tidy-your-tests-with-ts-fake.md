---
title: "Tidy your tests with ts-fake 1.0.0"
date: 2026-03-28
summary: "A ten-line TypeScript utility that lets unit tests declare exactly the fields they care about, and nothing more."
tags:
  - typescript
  - ts-fake
---

I spent a lot of 2024 and 2025 working on TypeScript monorepo projects. One thing that really bugged me: changes to database schema, API model, or DTO interfaces that would cascade type-check failures across dozens of unrelated tests. The tests didn't actually depend on the new field — they just held a fully-populated fixture, and the literal stopped compiling.

We tried a few approaches across these teams; none felt satisfying. So I wrote a ten-line utility called [`ts-fake`](https://github.com/laazyj/ts-fake), and after a year of using it across projects and - more recently watching coding agents pick it up cleanly - it's now at **1.0.0**.

This post is a walk through the problem, the implementation (it really is ten lines), and how the library behaves when interfaces evolve.

## The test I want to write

Suppose I'm testing this function:

```typescript
function processUser(user: UserProfile): string {
  return `Processing ${user.username} from ${user.organization.name}`;
}
```

`UserProfile` is the usual chunky DTO:

```typescript
interface UserProfile {
  userId: string;
  username: string;
  email: string;
  roles: Role[];
  organization: Organization;
  metadata: Record<string, string>;
}
```

The function reads two fields. So the test should only need to mention two fields:

```typescript
expect(processUser(/* ??? */)).toBe("Processing testuser from Test Co");
```

The question is what goes in the `???`. Every option I'd reach for has a problem.

## Four wrong answers

**1. Build the whole object.**

```typescript
const user: UserProfile = {
  userId: "u-1",
  username: "testuser",
  email: "test@example.com",
  roles: [],
  organization: {
    id: "o-1",
    name: "Test Co",
    settings: {},
  },
  metadata: {},
};
```

Verbose, brittle, and the test now lies about what it depends on. Add a non-optional field to `UserProfile` and every literal like this one breaks — including this test, which doesn't care about the new field.

**2. Share a fixture.**

```typescript
import { aUser } from "./fixtures";
const user = { ...aUser, username: "testuser" };
```

Now this test and every other one importing `aUser` share state. Tweaking `aUser` to suit one test risks breaking others, so people stop tweaking it. They adapt
their assertions to whatever data `aUser` already has, rather than writing the data their test actually needs. The fixture becomes a constraint and the variation
that was the whole point of having multiple tests quietly disappears. Less typing that option 1, but a worse outcome.

**3. Double-assert through `unknown`.**

```typescript
const user = {
  username: "testuser",
  organization: { name: "Test Co" },
} as unknown as UserProfile;
```

Compiles. Runs. Also compiles when you write `usrname: "testuser"`. Also compiles when you forget `organization` entirely and the function throws at runtime. The cast bypasses the type system — which is the only reason you reached for TypeScript in the first place.

**4. Use `Partial<UserProfile>`.**

```typescript
const user: Partial<UserProfile> = {
  username: "testuser",
  organization: { name: "Test Co" } as Organization,
};
processUser(user); // ❌ Partial<UserProfile> is not assignable to UserProfile
```

Closer — at least the input is type-checked. But the function expects a `UserProfile`, not a `Partial<UserProfile>`, so you have to cast back, and now you're at option 3 with extra steps.

## The fix

```typescript
import { fake } from "ts-fake";

const user = fake<UserProfile>({
  username: "testuser",
  organization: { name: "Test Co" },
});

expect(processUser(user)).toBe("Processing testuser from Test Co");
```

The input is checked: `usrname` errors, `organization: { naem: "x" }` errors, passing a `number` for `username` errors. The output is typed as `UserProfile`, so it slots straight into `processUser` with no cast.

## The whole library

Here's the source. The whole thing:

```typescript
type DeepPartial<T> = T extends (...args: unknown[]) => unknown
  ? T
  : { [P in keyof T]?: DeepPartial<T[P]> };

export function fake<T>(partial?: DeepPartial<T>): T {
  if (partial === undefined) return {} as T;
  return partial as T;
}
```

That's it. No proxies, no defaults, no runtime magic. The value `fake<T>(x)` returns is literally `x`. The work is all at the type level:

- The input is `DeepPartial<T>`, so the call site is checked against the interface — typos and shape mismatches fail to compile.
- The return type is `T`, so callers don't need to cast back. The function lies to the type system on the way out.

That lie is the whole point. At runtime `fake<T>(x)` is just `x` — unset fields are genuinely undefined, regardless of what TypeScript says. That's the contract, not a hazard: the fake declares what the test depends on, and a test that reads past its declaration fails loudly. The failure tells you the test was depending on something the fixture never claimed, which is exactly what you want to know.

## What happens when the interface changes

Here are three day-in-the-life scenarios demonstrating the maintainability claim.

**Day 1 — you write the test.** As above. Two fields, three lines, passes.

**Day 30 — someone adds a field.** A non-optional `shippingAddress: Address` is added to `UserProfile`. Each option behaves differently:

- The full-object fixture (option 1) breaks at the literal. The author has to invent a plausible `shippingAddress` even though this test doesn't read it.
- The double-assertion (option 3) silently keeps "working." If anything reads `user.shippingAddress.country` it returns `undefined` and the test passes anyway, masking real bugs.
- The `fake<UserProfile>` version compiles unchanged. If the test never touched the new field, it passes — zero maintenance cost. If something does read it (because the function under test was updated alongside the interface), the test fails loudly with `undefined`, per the contract above, pointing at the exact field the fixture is missing.

**Day 60 — a typo.** Someone writes `fake<UserProfile>({ usrname: "testuser" })`. TypeScript flags it as an unknown property. With `as unknown as UserProfile` the same typo compiles, and you find out at runtime — if at all.

## Nesting

The [examples in the repo](https://github.com/laazyj/ts-fake/tree/main/examples) use `fake<>` recursively:

```typescript
const customer = fake<Customer>({
  name: "Jane",
  address: fake<Address>({ city: "NYC" }),
});
```

`DeepPartial` already recurses, so you don't strictly need the inner `fake<Address>` — `address: { city: "NYC" }` works fine. The reason to write the inner `fake<>` is reuse:

```typescript
const nycAddress = fake<Address>({ city: "NYC" });
const customer = fake<Customer>({ name: "Jane", address: nycAddress });
const business = fake<Customer>({ name: "Acme", address: nycAddress });
```

For one-off tests, inline the partial. For shared scaffolding, extract a `fake<>` and reuse it.

## When not to use it

- **Not for production data.** There are no defaults — just `undefined`. If something downstream actually needs a real `UserProfile`, build a real `UserProfile`.
- **Not for realistic values or default-populated objects.** Use a value generator (e.g. `@faker-js/faker`) or factory library (e.g. `fishery`) instead.
- **Not when the type is small and pure data.** A literal you can write in full is its own spec. `fake<>` earns its keep on types that carry hard-to-build pieces (nested objects, inline functions, injected dependencies) the test doesn't exercise.
- **Not for runtime validation.** `fake<>` produces a value the type system _believes_ is a `T`. If you need an actual `T`, build one.

## A note on coding agents

`fake<T>` is unusually friendly to coding agents because the type signature is the spec, and the spec is enforced at the call site. An agent can't hallucinate `naem`, can't cast around the type system, and can't drift from the interface as it evolves. This is why I've kept reaching for it on agent-driven projects: the boundary between "what the test cares about" and "what the type system enforces" stays sharp without anyone having to police it.

## Try it

Ten lines on [npm](https://www.npmjs.com/package/ts-fake) and on [GitHub](https://github.com/laazyj/ts-fake). Read the source — it's quicker than reading this post. Break it and tell me what's missing.
