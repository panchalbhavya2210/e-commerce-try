<script>
  import supabase from "../../lib/index";
  import "../../lib/global.css";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  let emailVal, errorState, successState;

  async function forgotSent() {
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      emailVal,
      {
        redirectTo: "https://e-commerce-try.vercel.app/UpdatePass",
      }
    );
  }
</script>

<div
  transition:fly={{ y: 200 }}
  class="flex min-h-full flex-col justify-center px-6 py-6 lg:px-8"
>
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img
      class="mx-auto h-10 w-auto"
      src="https://raw.githubusercontent.com/panchalbhavya2210/e-commerce-try/main/src/lib/Screenshot_2023-10-15_162702-transformed-removebg-preview.png"
      alt="Your Company"
    />
    <h2
      class="mt-2 text-center text-2xl font-medium leading-9 tracking-tight text-gray-900"
    >
      Sign in to your account
    </h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6">
      <div>
        <label
          for="email"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Email address</label
        >
        <div class="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            bind:value={emailVal}
            class="font-medium p-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          on:click={forgotSent}
          class="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black hover:transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >Send Reset Link</button
        >
      </div>
    </form>

    <p class="mt-10 text-center text-sm text-gray-500">
      Remembered the password?
      <a
        href="/Login"
        class="font-semibold leading-6 text-gray-700 hover:text-black underline"
        >Login</a
      >
    </p>

    <div
      class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md w-96 max-w-sm fixed bottom-5 transition-all duration-300 {successState
        ? 'translate-y-0 opacity-100'
        : 'translate-y-24 opacity-0'}"
      role="alert"
    >
      <div class="flex">
        <div class="py-1">
          <svg
            class="fill-current h-6 w-6 text-teal-500 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            ><path
              d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"
            /></svg
          >
        </div>
        <div>
          <p class="font-bold">An Email Has Been Sent.</p>
          <p class="text-sm break-all">
            Click On A Link To Login & Change Password.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
