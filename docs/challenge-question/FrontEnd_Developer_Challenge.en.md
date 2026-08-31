# FrontEnd Developer Challenge

# Integrated Code Snippet Management Dashboard

In this challenge, you must implement the user interface for a dashboard to write and manage code snippets, and complete the data round-trip by building a simple API within the same frontend stack.

## Front-end Requirements

### Code Editor Integration

Use packages such as **Monaco Editor** or **CodeMirror** within the UI to provide code editing with syntax highlighting.

### Advanced State Management

The user must be able to open multiple files or tabs and switch between them (without persisting to a database) without losing the code they have written.

### Output Console Simulation

Design a section at the bottom of the page to display the output of executed code (success or error text) with a design similar to standard terminals.

---

## Implementation Notes

There is no need to set up a separate database or server. You are expected to use your framework's server-side capabilities (such as `server/api` in Nuxt 3 or similar tools) to write a simple endpoint (**Mock API**) that performs the following tasks:

### Initial Validation

Receive the code sent from the client and verify that the payload structure is correct and that the code body is not empty.

### Network and Processing Simulation

Introduce an intentional delay of **2 to 3 seconds** to evaluate your ability to manage loading states and disable buttons on the frontend.

### Random Response Generation

Randomly, in **80%** of cases, return a successful response such as:

```json
{"status": "success", "output": "Hello World"}
```

And in **20%** of cases, return a server error so that error handling in the UI can be evaluated.

---

## Expected Deliverables and Documentation

- Clean, well-structured code in a repository (GitHub/GitLab) with meaningful commits.
- A `README.md` file including project setup instructions and a brief explanation of how the Mock API was implemented.
- Responsive design for use on tablets and desktops.
