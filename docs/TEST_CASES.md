# P10 Postman Test Cases

| TC | Scenario | Expected |
|---|---|---|
| TC01 | Register with valid details | 201 + pending user/account |
| TC02 | Duplicate email | 409 |
| TC03 | Login valid customer | 200 + JWT |
| TC04 | Login wrong password | 401 |
| TC05 | Protected route without token | 401 |
| TC06 | Customer calls staff route | 403 |
| TC07 | Staff approves pending account | 200 + active account |
| TC08 | Transfer without active source | 409 |
| TC09 | Transfer above balance/minimum | 409 |
| TC10 | Transfer above daily limit | 409 |
| TC11 | Transfer to untrusted external account | 403 |
| TC12 | Valid transfer | 201 + two ledger entries |
| TC13 | Amount above suspicious threshold | transaction flagged |
| TC14 | Invalid MongoDB ID | 400 |
| TC15 | Statement invalid date range | 400 |
| TC16 | Staff freezes account | 200 |
| TC17 | Frozen account transaction | 409 |
| TC18 | Staff unfreezes account | 200 |
| TC19 | Interest job | interest transaction for eligible savings accounts |
| TC20 | Missing required field | 400 |
