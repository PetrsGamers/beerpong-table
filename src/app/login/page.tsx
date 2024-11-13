"use server";

import { getSession, login, logout } from "@/actions/auth";

export default async function Page() {
  //await logout();
  const session = await getSession();

  if (session?.userId) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col items-center">
          <p className="m-4">
            You&apos;re logged in as user id #{String(session?.userId)}.
          </p>
          <form action={logout}>
            <button type="submit" className="btn">
              Log out
            </button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <form
      action={login}
      className="max-w-sm mx-auto p-8 bg-gray-900 rounded-lg shadow-lg"
    >
      <div className="mb-6">
        <label
          htmlFor="name"
          className="block text-gray-300 font-semibold mb-2"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          placeholder="Name"
          className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-gray-300 font-semibold mb-2"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button type="submit" className="w-full p-3 btn">
        Log in
      </button>
    </form>
  );
}
