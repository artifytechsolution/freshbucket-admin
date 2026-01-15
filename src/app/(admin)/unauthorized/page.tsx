export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <svg
            className="w-20 h-20 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M5.07 19H18.93a2 2 0 001.77-2.83L13.77 4.83a2 2 0 00-3.54 0L3.3 16.17A2 2 0 005.07 19z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Unauthorized Access
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          You don’t have permission to view this page.  
          Please log in with the correct credentials or contact the administrator.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <a
            href="/login "
            className="w-full px-5 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 transition"
          >
            Go to Login
          </a>
          <a
            href="/"
            className="w-full px-5 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg shadow hover:bg-gray-300 transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
