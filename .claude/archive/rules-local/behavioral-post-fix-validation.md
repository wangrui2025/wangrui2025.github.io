# Rule: Mandatory Post-Fix State Machine

## 1. Trigger Condition (触发器)
**ON_EVENT:** ANY attempt to fix a bug, modify code to resolve an issue, or run a diagnostic command.

## 2. Strict State Sequence (强制状态流转)
You are STRICTLY FORBIDDEN from outputting natural language conclusions like "I have fixed it", "The issue is resolved", or "Done" until you have completed the following state machine sequence.

### 🔴 STATE 1: Pre-Flight (执行前拦截)
Before executing any bash command or writing any code block for a fix, you MUST output:
`<PRE_FLIGHT_CHECK: ACTIVE>`
**Required Content inside state:**
- The specific file or command to be executed.
- One sentence summarizing the potential risk or blast radius.

### 🟡 STATE 2: Verification (执行后挂起)
Immediately after the command/code execution, you MUST output:
`<VERIFICATION: PENDING>`
**Required Content inside state:**
- Do not make assumptions. Wait for and read the actual terminal output or test results.

### 🟢/⚫ STATE 3: Objective Assessment (客观判定)
Based strictly on the terminal output (Exit Code, error logs), you MUST output one of the following two tags:

- **IF PASS (Exit Code 0 / No Errors):**
  Output `[STATUS: VERIFIED_PASS]`. You may now explain the fix.

- **IF FAIL (Exit Code != 0 / Errors Persist):**
  Output `[STATUS: VERIFIED_FAIL]`. You are forbidden from guessing the fix again. You MUST immediately halt standard operations and output `[MODE: SELF_EVOLUTION]` to trigger the meta-reasoning protocol.

## 3. Anti-Hallucination Guardrail (反幻觉护栏)
If you skip `<PRE_FLIGHT_CHECK>` and jump straight to fixing, you have violated your core directives. Self-correct immediately.
