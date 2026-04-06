import { useApp } from "../../context";

export function ClockWidget() {
  const { currentTime, dragWidget } = useApp();
  const { clockPos, handleDragStart, resetClockPos } = dragWidget;

  return (
    <div
      className="hidden md:block fixed z-40"
      style={{ left: `${clockPos.x}px`, top: `${clockPos.y}px` }}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 cursor-move"
        onMouseDown={(e) => handleDragStart("clock", e)}
        onDoubleClick={() => resetClockPos()}
      >
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="55"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-300 dark:text-gray-600"
          />
          {[...Array(12)].map((_, i) => {
            const angle = ((i * 30 - 90) * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={60 + 45 * Math.cos(angle)}
                y1={60 + 45 * Math.sin(angle)}
                x2={60 + 50 * Math.cos(angle)}
                y2={60 + 50 * Math.sin(angle)}
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-400 dark:text-gray-500"
              />
            );
          })}
          <line
            x1="60"
            y1="60"
            x2={
              60 +
              30 *
                Math.cos(
                  (((currentTime.getHours() % 12) * 30 +
                    currentTime.getMinutes() * 0.5 -
                    90) *
                    Math.PI) /
                    180,
                )
            }
            y2={
              60 +
              30 *
                Math.sin(
                  (((currentTime.getHours() % 12) * 30 +
                    currentTime.getMinutes() * 0.5 -
                    90) *
                    Math.PI) /
                    180,
                )
            }
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="text-gray-900 dark:text-gray-100"
          />
          <line
            x1="60"
            y1="60"
            x2={
              60 +
              40 *
                Math.cos(
                  ((currentTime.getMinutes() * 6 - 90) * Math.PI) / 180,
                )
            }
            y2={
              60 +
              40 *
                Math.sin(
                  ((currentTime.getMinutes() * 6 - 90) * Math.PI) / 180,
                )
            }
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-gray-700 dark:text-gray-300"
          />
          <line
            x1="60"
            y1="60"
            x2={
              60 +
              45 *
                Math.cos(
                  ((currentTime.getSeconds() * 6 - 90) * Math.PI) / 180,
                )
            }
            y2={
              60 +
              45 *
                Math.sin(
                  ((currentTime.getSeconds() * 6 - 90) * Math.PI) / 180,
                )
            }
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-gray-500 dark:text-gray-400"
          />
          <circle
            cx="60"
            cy="60"
            r="3"
            fill="currentColor"
            className="text-gray-900 dark:text-gray-100"
          />
        </svg>
        <div className="mt-3 text-center">
          <div className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
