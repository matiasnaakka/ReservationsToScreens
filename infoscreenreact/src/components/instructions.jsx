import React from "react";

const Instructions = () => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md text-sm border border-gray-300">
      <h2 className="text-lg font-semibold text-orange-600 mb-3">Using URL Parameters</h2>
      <p className="text-gray-700 mb-3">
        You can control the app's behavior using URL parameters. These allow you to filter floors, toggle auto-scroll, set loop mode, and more.
      </p>

      <ul className="list-disc pl-5 text-gray-700 space-y-3">
        <li>
          <strong className="text-orange-600">floor</strong>: Display available rooms for a specific floor.
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">?floor=6</code>
          <br />
          <span className="text-gray-600 text-xs">
            If omitted, rooms from all floors will be shown.
          </span>
          <br />
          <span className="text-red-600 font-semibold text-xs">
            ⚠️ `loopMode=true` ignores the `floor` setting.
          </span>
        </li>

        <li>
          <strong className="text-orange-600">reservable</strong>: Filter rooms by user type.
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">?reservable=students</code>
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">?reservable=staff</code>
        </li>

        <li>
          <strong className="text-orange-600">showFree</strong>: Show all available rooms across all floors.
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">?showFree=true</code>
          <br />
          <span className="text-gray-600 text-xs">
            Hides the floor map and shows a full list of free rooms.
          </span>
        </li>

        <li>
          <strong className="text-orange-600">loopMode</strong>: Enable automated screen cycling.
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">?loopMode=true</code>
          <br />
          <span className="text-gray-600 text-xs">
            Cycles between room list → map → feedback automatically.
          </span>
          <br />
          <span className="text-red-600 font-semibold text-xs">
            ⚠️ Cannot be used with a specific floor (`floor=`).
          </span>
        </li>

        <li>
          <strong className="text-orange-600">loopRoomTime / loopMapTime / loopFeedbackTime</strong>: Set durations (in seconds) for each loop screen.
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">?loopRoomTime=15</code>
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">?loopMapTime=5</code>
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">?loopFeedbackTime=10</code>
          <br />
          <span className="text-gray-600 text-xs">
            Defines how long each screen stays visible in loop mode.
          </span>
        </li>

        <li>
          <strong className="text-orange-600">autoScroll</strong>: Enable automatic vertical scrolling in room list view.
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">?autoScroll=true</code>
          <br />
          <span className="text-gray-600 text-xs">
            Ideal for digital signage or unattended display setups.
          </span>
        </li>

        <li>
          <strong className="text-orange-600">Combining Parameters</strong>: You can combine multiple parameters.
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">
            ?reservable=students&autoScroll=true&loopMode=true&loopRoomTime=12
          </code>
          <br />
          <span className="text-red-600 font-semibold text-xs">
            ⚠️ `loopMode=true` overrides the `floor` filter and shows all floors.
          </span>
        </li>
      </ul>

      <p className="text-gray-700 mt-4 text-sm">
        Need a refresh? Just update the URL and reload the page.
      </p>
    </div>
  );
};

export default Instructions;
