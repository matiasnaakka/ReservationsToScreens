<script lang="ts">
  let isGuideVisible = false;

  const parameterGroups = [
    {
      title: 'Location Parameters',
      params: [
        {name: 'Floor', param: 'floor=5', note: 'Available: 2, 5, 6, 7'},
        {name: 'Building', param: 'building=KM', note: 'Available: KM'},
        {
          name: 'You Are Here Floor',
          param: 'floorYouAreHere=5',
          note: 'Floor for "You Are Here" marker (default: 5)'
        },
        {name: 'X coordinate', param: 'x=3', note: 'Default: 3'},
        {name: 'Y coordinate', param: 'y=6.4', note: 'Default: 6.4'}
      ]
    },
    {
      title: 'Display Settings',
      params: [
        {name: 'Mode', param: 'mode=map', note: 'Available: map, list'},
        {
          name: 'Show feedback',
          param: 'showFeedback=true',
          note: 'Default: false'
        },
        {name: 'Show URL', param: 'showUrl=true', note: 'Default: false'},
        {
          name: 'Show Params Demo',
          param: 'showParamDemo=true',
          note: 'Shows active parameters at top of screen'
        },
        {
          name: 'Reservable type',
          param: 'reservable=staff',
          note: 'Available: all, staff, students'
        },
        {
          name: 'Room details',
          param: 'details=yhteistyötila',
          note: 'Filter by room details (e.g., "yhteistyötila")'
        },
        {
          name: 'Group details',
          param: 'groupDetails=groupwork',
          note: 'Available: work, studyspace, groupwork, other'
        }
      ]
    },
    {
      title: 'Time & Date',
      params: [
        {name: 'Specific date', param: 'specificdate=2025-01-13'},
        {
          name: 'Translation interval',
          param: 'translationInterval=15000',
          note: 'Default: 15000ms'
        },
        {
          name: 'Update interval',
          param: 'updateInterval=300000',
          note: 'Default: 300000ms'
        }
      ]
    },
    {
      title: 'Scroll Settings',
      params: [
        {name: 'Auto-scroll', param: 'autoScroll=true'},
        {
          name: 'Scroll speed',
          param: 'scrollSpeed=1',
          note: 'Default: 1 pixel per interval'
        },
        {
          name: 'Scroll interval',
          param: 'scrollInterval=50',
          note: 'Default: 50ms'
        },
        {
          name: 'Scroll pause',
          param: 'scrollPause=1000',
          note: 'Default: 1000ms at ends'
        }
      ]
    }
  ];

  // Function to generate the full demo URL
  const generateDemoUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params =
      '?floor=5&building=KM&floorYouAreHere=5&specificdate=2025-01-13&reservable=staff&mode=map&showFeedback=false' +
      '&updateInterval=300000&translationInterval=15000&autoScroll=true&scrollSpeed=1' +
      '&scrollInterval=50&scrollPause=1000&showUrl=true&x=3&y=6.4&details=yhteistyötila' +
      '&groupDetails=groupwork&showParamDemo=true';
    return baseUrl + params;
  };

  // Handle opening the demo URL
  const openDemoUrl = () => {
    const url = generateDemoUrl();
    window.open(url, '_blank');
  };
</script>

<div class="m-4">
  <button
    on:click={() => (isGuideVisible = !isGuideVisible)}
    class="rounded-md bg-metropoliaMainOrange px-6 py-2.5 font-heading text-sm font-bold
           text-white transition-colors duration-200 hover:bg-metropoliaSecondaryOrange
           focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange/50"
  >
    {isGuideVisible
      ? '✕ Hide Parameters Guide'
      : '⚙ Show URL Parameters Guide'}
  </button>

  {#if isGuideVisible}
    <div class="mt-4 rounded-lg bg-white p-6 shadow-lg">
      <h2 class="mb-6 font-heading text-xl font-bold text-metropoliaMainGrey">
        URL Parameters Documentation
      </h2>

      <div class="grid gap-8 md:grid-cols-2">
        {#each parameterGroups as group}
          <div class="rounded-md bg-gray-50 p-4">
            <h3
              class="mb-4 font-heading text-lg font-semibold text-metropoliaMainOrange"
            >
              {group.title}
            </h3>
            <ul class="space-y-3">
              {#each group.params as { name, param, note }}
                <li class="rounded-md bg-white p-3 shadow-sm">
                  <div class="font-heading font-medium text-metropoliaMainGrey">
                    {name}
                  </div>
                  <code
                    class="mt-1 block rounded bg-gray-100 px-2 py-1 font-mono text-sm text-metropoliaSecondaryOrange"
                  >
                    ?{param}
                  </code>
                  {#if note}
                    <span class="mt-1 block text-xs text-gray-500">
                      {note}
                    </span>
                  {/if}
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>

      <div class="mt-8 rounded-md bg-gray-50 p-4">
        <h3
          class="mb-3 font-heading text-lg font-semibold text-metropoliaMainOrange"
        >
          Complete URL Example
        </h3>
        <div class="flex flex-col">
          <code
            class="block break-all rounded-md bg-white p-4 text-xs leading-relaxed text-metropoliaMainGrey shadow-sm"
          >
            ?floor=5&building=KM&floorYouAreHere=5&specificdate=2025-01-13&reservable=staff&mode=map&showFeedback=false
            &updateInterval=300000&translationInterval=15000&autoScroll=true&scrollSpeed=1
            &scrollInterval=50&scrollPause=1000&showUrl=true&x=3&y=6.4&details=yhteistyötila
            &groupDetails=groupwork&showParamDemo=true
          </code>
          <button
            on:click={openDemoUrl}
            class="mt-3 self-end rounded-md bg-metropoliaMainOrange px-4 py-2 font-heading text-sm font-bold
                   text-white transition-colors duration-200 hover:bg-metropoliaSecondaryOrange
                   focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange/50"
          >
            🚀 Open Demo URL
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
