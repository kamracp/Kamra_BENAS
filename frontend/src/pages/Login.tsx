export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">

      <div className="w-full max-w-md rounded-xl bg-white p-10 shadow-xl">

        <h1 className="text-3xl font-bold">
          BENAS Login
        </h1>

        <p className="mt-2 text-slate-500">
          Authentication will be integrated with Keycloak.
        </p>

        <input
          className="mt-8 w-full rounded-lg border p-3"
          placeholder="Email Address"
        />

        <input
          type="password"
          className="mt-4 w-full rounded-lg border p-3"
          placeholder="Password"
        />

        <button className="mt-6 w-full rounded-lg bg-blue-600 p-3 font-semibold text-white">
          Sign In
        </button>

      </div>

    </div>
  );
}