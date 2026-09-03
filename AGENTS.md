# AGENTS.md

## Project overview

This repository contains a browser-based city-building strategy game built with React and Vite. The application code lives in the [game](game) app, while the repository root contains the project description in [README.md](README.md).

## Quick start

Use the Vite app commands from the [game/package.json](game/package.json):

- `cd game`
- `npm install`
- `npm run dev` to start the local app
- `npm run build` to create a production build
- `npm run lint` to run the project linter

## Architecture

The game is organized around data-driven definitions and a single main app:

- [game/src/App.jsx](game/src/App.jsx): main gameplay loop, state setup, UI rendering, and logic for city building, resources, quests, and world objects
- [game/src/data](game/src/data): static game catalogs and tuning values (buildings, plots, progression, tutorial, config)
- [game/src/systems/persistence.js](game/src/systems/persistence.js): save/load behavior for local storage
- [game/src/assets](game/src/assets): art assets, such as the city background image

The app uses a default state object and loads a persisted save on startup. Keep the shape of the in-memory state and persisted data aligned when adding new fields.

## Conventions for AI agents

- Prefer small, data-driven changes in the config and catalog files over hard-coded UI hacks.
- When adding a new building, resource, troop, or research item, update the matching catalog plus any dependent default state or unlock logic.
- Respect the existing naming conventions in the game data: Turkish resource names, stable id values, and matching arrays/objects are intentional.
- Preserve the current state model in [game/src/App.jsx](game/src/App.jsx) and ensure save/load compatibility when new fields are introduced.
- Keep edits localized to the relevant feature area instead of reworking broader game systems unless the task requires it.
- Use the existing project conventions for React functional components and Vite configuration rather than introducing new frameworks or build tools.

## Useful references

- [README.md](README.md)
- [game/README.md](game/README.md)
- [game/src/data/gameConfig.js](game/src/data/gameConfig.js)
- [game/src/data/cityBuildings.js](game/src/data/cityBuildings.js)
- [game/src/data/cityPlots.js](game/src/data/cityPlots.js)
- [game/src/data/cityProgression.js](game/src/data/cityProgression.js)
- [game/src/data/cityTutorial.js](game/src/data/cityTutorial.js)

## Working style

- Treat the game as a content-heavy simulation: most behavior is authored through configuration arrays and derived logic.
- Verify changes with `npm run build` or `npm run lint` when changing gameplay logic or UI structure.
- If a feature touches save compatibility, test the load/save flow and keep old data safe.
- Do not add broad abstractions unless required by the specific change.
