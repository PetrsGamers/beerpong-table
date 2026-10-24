"use server";

import { getSession, login, logout } from "@/actions/auth";

export default async function Page() {
  //await logout();
  const session = await getSession();

  if (session?.userId) {
    return (
      <div className="flex-1 flex justify-center items-start pt-24 bg-black">
        <div className="flex flex-col items-center">
          <p className="m-4">
            You&apos;re logged in as user id #{String(session?.userId)}.
          </p>
          <form action={logout}>
            <button type="submit" className="btn btn-outline">
              Log out
            </button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 flex justify-center items-start pt-24 bg-black">
      <form
        action={login}
        className="w-full max-w-sm mx-auto p-8 bg-base-200 rounded-2xl shadow-xl border border-base-300"
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
            className="input input-bordered w-full"
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
            className="input input-bordered w-full"
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Log in
        </button>
      </form>
    </div>
  );
}
