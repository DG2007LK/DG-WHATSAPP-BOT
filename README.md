# DG WhatsApp Bot

DG WhatsApp Bot is a Node.js service that pairs WhatsApp accounts through Baileys. It serves a browser-based pairing page, provides pairing and session-management HTTP routes, and handles a small set of WhatsApp message commands.

## Requirements

- Node.js 22 or newer
- npm
- Network access to WhatsApp and the Firebase Realtime Database endpoint configured in `pair.js`

## Quick start

```bash
npm install
npm start
```

The server listens on port `8000` by default. Set `PORT` to use a different port:

```bash
PORT=3000 npm start
```

Open `http://localhost:8000` (or the port you configured). The same pairing page is served at `/` and `/pair`.

## Pair a WhatsApp account

1. Open the pairing page and enter a phone number with its country code, using digits only. The page requires at least 11 digits.
2. Select **Generate Code** and wait for the pairing code.
3. In WhatsApp, open **Settings → Linked Devices → Link a Device → Link with phone number**, then enter the code.

The pairing API is `GET /code?number=<country-code-and-number>`. It returns a JSON object containing `code` when a pairing code is generated; if the number is already connected, it returns an `already_connected` status instead.

## WhatsApp commands

The command prefix is `.` in the current source. Implemented command cases include:

| Command          | Behavior                                                                  |
| ---------------- | ------------------------------------------------------------------------- |
| `.alive`         | Replies with bot and time information.                                    |
| `.menu`          | Shows the menu and its numbered submenus.                                 |
| `.pair <number>` | Requests a pairing code from the configured remote pairing service.       |
| `.ping`          | Measures the bot's response time.                                         |
| `.deleteme`      | Deletes the current account's session using the session cleanup function. |
| `.owner`         | Sends the configured owner contact.                                       |

The menu text mentions additional command names, but the command handler in `pair.js` does not implement those commands in the inspected switch statement.

## HTTP routes

The routes below are mounted under `/code`:

| Route                                           | Purpose                                                                   |
| ----------------------------------------------- | ------------------------------------------------------------------------- |
| `GET /code?number=...`                          | Request a pairing code.                                                   |
| `GET /code/active`                              | Return the count and numbers of active sessions.                          |
| `GET /code/ping`                                | Return service status and active-session count.                           |
| `GET /code/botinfo`                             | Return status and uptime details for active sessions.                     |
| `GET /code/connect-all`                         | Initiate connections for numbers stored in Firebase.                      |
| `GET /code/reconnect`                           | Initiate reconnections for credentials found in Firebase.                 |
| `GET /code/update-config?number=...&config=...` | Request an OTP before updating the supplied JSON configuration.           |
| `GET /code/verify-otp?number=...&otp=...`       | Verify the OTP and save the pending configuration.                        |
| `GET /code/getabout?number=...&target=...`      | Fetch the target account's WhatsApp About status using an active session. |

`/code/connect-all` and `/code/reconnect` are operational endpoints, not read-only status checks.

## Configuration and session data

| Setting        | Default                | Source                                                                            |
| -------------- | ---------------------- | --------------------------------------------------------------------------------- |
| `PORT`         | `8000`                 | `index.js`                                                                        |
| `NODE_ENV`     | Not set by the project | `pair.js`; selects the Pino log level (`fatal` in production, `debug` otherwise). |
| `PM2_NAME`     | `SUPUN-MINI-main`      | `pair.js`; used in its PM2 restart command.                                       |
| Command prefix | `.`                    | Hard-coded in `pair.js`.                                                          |

The code stores local Baileys authentication files under `session/session_<number>` and reads and writes session credentials, saved numbers and per-number configuration through the Firebase Realtime Database URL hard-coded in `pair.js`. Session data is sensitive; protect the Firebase database and local `session/` directory accordingly. The project does not define Firebase settings through environment variables.

## Security and privacy

The Express routes under `/code` are registered without route-level authentication in the current source. Several expose account or session information or initiate account connections and configuration routes accept values through query parameters. Do not expose this service to an untrusted network without adding appropriate access control and transport protections. Treat pairing codes, phone numbers and session credentials as private.

## Project layout

| Path                | Purpose                                                                            |
| ------------------- | ---------------------------------------------------------------------------------- |
| `index.js`          | Starts the Express server, serves the pairing page and mounts the pairing router. |
| `pair.js`           | Baileys socket lifecycle, message commands, pairing and session HTTP routes.       |
| `public/index.html` | Browser-based pairing interface.                                                   |
| `lib/msg.js`        | WhatsApp message helpers and media download support.                               |
| `lib/admin.json`    | Phone-number list used for connection notifications to admins.                     |
| `session/`          | Local Baileys authentication state.                                                |
| `package.json`      | Runtime requirement, dependencies and npm scripts.                                |

## Scripts

- `npm start` starts the server with `node index.js`.
- `npm test` currently exits with an “Error: no test specified” message; no automated test suite is configured in `package.json`.

## License

This project is licensed under the [MIT License](LICENSE).
