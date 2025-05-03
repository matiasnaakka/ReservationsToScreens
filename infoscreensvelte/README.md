# create-svelte

Everything you need to build a Svelte library, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

Read more about creating a library [in the docs](https://svelte.dev/docs/kit/packaging).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```bash
npm run package
```

To create a production version of your showcase app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```bash
npm publish
```

## Project Structure

The project is organized as follows:

- `src/`: Contains the source code for the project.
  - `components/`: Contains Svelte components.
  - `stores/`: Contains Svelte stores for state management.
  - `config/`: Contains configuration files.
  - `hooks/`: Contains custom hooks.
  - `utils/`: Contains utility functions.
  - `types/`: Contains TypeScript type definitions.
  - `routes/`: Contains SvelteKit routes.
  - `data/`: Contains static data files.
  - `static/`: Contains static assets.

## Components

### Header.svelte

The `Header` component is responsible for displaying the header of the application.

#### Props

- `startDate` (string): The start date for the header.
- `showReservationsParam` (boolean): Whether to show reservations.
- `floorParam` (string | null): The floor parameter.
- `buildingParam` (string | null): The building parameter.
- `roomsLoaded` (boolean): Whether the rooms are loaded.
- `reservableTypeParam` ('all' | 'staff' | 'students'): The type of reservable rooms.
- `intervalParam` (number): The interval parameter.

### Main.svelte

The `Main` component is responsible for displaying the main content of the application.

#### Props

- `isActive` (boolean): Whether the main content is active.
- `INACTIVITY_TIMEOUT` (number): The inactivity timeout.

## Stores

### activityStore.ts

The `activityStore` is responsible for managing the activity state of the application.

### freeSpaceStore.ts

The `freeSpaceStore` is responsible for managing the free space data of the application.

## API Configuration

### api.config.ts

The `api.config.ts` file contains the configuration for the API.

## Usage Examples

### Header Component

```svelte
<script>
  import Header from './components/Header.svelte';

  let startDate = '2023-01-01';
  let showReservationsParam = true;
  let floorParam = '5';
  let buildingParam = 'KM';
  let roomsLoaded = true;
  let reservableTypeParam = 'all';
  let intervalParam = 300000;
</script>

<Header
  {startDate}
  {showReservationsParam}
  {floorParam}
  {buildingParam}
  {roomsLoaded}
  {reservableTypeParam}
  {intervalParam}
/>
```

### Main Component

```svelte
<script>
  import Main from './components/Main.svelte';
  import { isActive, INACTIVITY_TIMEOUT } from './stores/activityStore.js';
</script>

<Main {isActive} {INACTIVITY_TIMEOUT} />
```

## Edge Cases

### Header Component

- If `floorParam` or `buildingParam` is null, the corresponding information will not be displayed.
- If `roomsLoaded` is false, the header will not be displayed.

### Main Component

- If `isActive` is false, the main content will not be displayed.
- If `INACTIVITY_TIMEOUT` is not set, the default value will be used.
