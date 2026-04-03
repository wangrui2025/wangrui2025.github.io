---
paths:
  - "**/*.py"
  - "**/*.pyi"
---
# Python Testing

> This file extends [common/testing.md](../common/testing.md) with Python specific content.

## Framework

Use **pytest** as the testing framework.

## Coverage

```bash
pytest --cov=src --cov-report=term-missing
```

## Test Organization

Use `pytest.mark` for test categorization:

```python
import pytest

@pytest.mark.unit
def test_calculate_total():
    ...

@pytest.mark.integration
def test_database_connection():
    ...
```

## TDD Approach for Python

**MANDATORY workflow:**
1. Write test first (`test_*.py`)
2. Run test — it should FAIL (RED)
3. Implement minimal code to pass (GREEN)
4. Refactor (IMPROVE)
5. Verify coverage (80%+)

```bash
pytest                        # Run all tests
pytest --cov=src --cov-report=term-missing  # With coverage
pytest -v -k "test_name"      # Run specific test
pytest --lf                    # Run last failed tests
```

## Reference

See skill: `python-testing` for detailed pytest patterns and fixtures.
