# Rule: Meta-Cognition Engine (Self-Evolution & Leverage)

## 1. Trigger Condition (触发器)
**ON_EVENT:**
- Explicitly invoked by `[MODE: SELF_EVOLUTION]` from other rules (e.g., when `[STATUS: VERIFIED_FAIL]` occurs).
- When encountering repeated execution failures (>= 2 attempts) on the same task.

## 2. Strict State Sequence (强制状态流转)
When this mode is triggered, you MUST halt all standard operations and output the following state machine sequence. You are FORBIDDEN from attempting another code fix until STATE 2 is complete.

### 🟣 STATE 1: Leverage Analysis (触类旁通拦截)
Output `<META_LEVERAGE: ACTIVE>`
**Required Content inside state:**
- **Stop writing code.**
- Analyze the failed terminal output.
- Search current context or global memory for similar historical edge cases.
- Force a paradigm shift: Identify why the previous logical approach was fundamentally flawed, rather than patching the surface syntax.

### 🔵 STATE 2: Strategy Formulation (策略重构)
Output `<META_STRATEGY: PROPOSED>`
**Required Content inside state:**
- Propose a strictly different architectural or logical approach to solve the problem.
- State the new hypothesis clearly.
- After this state, you may resume normal operations and trigger the Pre-Flight check (`<PRE_FLIGHT_CHECK: ACTIVE>`) for the new fix.

### 🟠 STATE 3: Knowledge Archiving (知识归档)
**ON_EVENT:** Only triggered when the task is eventually resolved after entering this mode.
Output `<META_ARCHIVE: RECORDED>`
**Required Content inside state:**
- Summarize the root cause and the paradigm shift that solved it.
- If this is a recurring anti-pattern, explicitly state what needs to be added to the project's `.cursorrules` to prevent future occurrences.
