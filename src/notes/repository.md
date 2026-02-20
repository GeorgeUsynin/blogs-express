## Repository Responsibilities

**Repository is infrastructure.**  
It should not be aware of the business meaning of “does not exist.”

### It should:

- Return an entity  
- Return `null`  
- Throw an infrastructure error (DB down, timeout, etc.)

---

### Important

The decision:

> “If it doesn’t exist — return 404”

should be made in the **application / service layer**, not in the repository.
