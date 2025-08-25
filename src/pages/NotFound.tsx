export default function NotFound() {
  return (
    <section className="flex h-screen flex-col items-center justify-center bg-gray-900 text-center text-white px-4">
      <h1 className="text-7xl font-extrabold text-red-500 drop-shadow-lg">
        404
      </h1>
      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-gray-400">
        The page you are looking for does not exist.
      </p>
      <p className="text-gray-400">
        Please check the URL or return to the homepage.
      </p>

      <a
        href="/"
        className="mt-6 inline-block rounded-xl bg-red-500 px-6 py-3 text-lg font-medium text-white shadow-lg transition hover:bg-red-600"
      >
        Go Back Home
      </a>
    </section>
  );
}
