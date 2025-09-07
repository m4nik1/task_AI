import { formatDate } from "@/lib/utils";

interface DateNavigationProps {
  currentDate: Date;
  navigateDate: (direction: number) => void;
}

export default function DateNavigation({
  currentDate,
  navigateDate,
}: DateNavigationProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
      <div className="items-center gap-2">
        <div className="bg-black text-white px-2 py-1 rounded text-sm font-medium ease-out">
          {formatDate(currentDate)}
        </div>
        <button className="p-1 hover-bg-gray-200 rounded">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinejoin="round" strokeWidth={2} d="M15 101-7-7 7-7" />
          </svg>
        </button>
        <button
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          onClick={() => navigateDate(-1)}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          onClick={() => navigateDate(1)}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <div className="text-sm text-gray-600 transition-all duration-300 ease-in-out">
        {formatDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000))}
      </div>
    </div>
  );
}
