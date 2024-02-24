<script>
  import supabase from "../../lib/index";
  import "../../lib/global.css";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  let selected, progressSignUp, successState, errorState, errBody, errTitle;
  function onChange(event) {
    selected = event.currentTarget.value;
    console.log(selected);
  }
  let emailVal;
  let us;
  const validateEmail = (email) => {
    us = String(email)
      .toLowerCase()
      .match(
        /\b[A-Za-z0-9._%+-]+@(gmail\.com|outlook\.com|yahoo\.com|protonmail\.com)\b/
      );
  };

  let files, firstName, lastName, password, uid;

  async function mainFunction() {
    validateEmail(emailVal);
    if (us != null) {
      if (files != undefined) {
        let file = files[0].name;
        let fileIt = files[0];
        progressSignUp = !progressSignUp;
        const { data, error } = await supabase.auth.signUp({
          email: emailVal,
          password: password,
        });
        if (error == null) {
          progressSignUp = !progressSignUp;
          successState = !successState;
          setTimeout(() => {
            successState = !successState;
          }, 3000);
        } else {
          progressSignUp = !progressSignUp;
          errorState = !errorState;
          errTitle = error.name;
          errBody = error.message;

          setTimeout(() => {
            errorState = !errorState;
          }, 3000);
          console.log(error.name, error.message);
        }
        const uid = data.user.id;
        if (selected == "User") {
          async function pushData() {
            const { data1, error1 } = supabase.storage
              .from("profiles")
              .upload(`${uid}/${file}`, fileIt);

            const { data } = await supabase.storage
              .from("profiles")
              .getPublicUrl(`${uid}/${file}`);
            console.log(data);
            let imageUrl = data.publicUrl;
            const userDataToInsert = [
              {
                auth_uid: uid,
                user_name: firstName + " " + lastName,
                user_email: emailVal,
                user_profile: imageUrl,
                user_address: "",
                user_type: "User",
              },
            ];
            console.log(userDataToInsert);
            const { error } = await supabase
              .from("user_auth_data")
              .insert(userDataToInsert);
            console.log(error);
          
          }
          setTimeout(() => {
            pushData();
          });
        } else {
          async function pushData() {
            const { data1, error1 } = supabase.storage
              .from("profiles")
              .upload(`${uid}/${file}`, fileIt);

            const { data } = await supabase.storage
              .from("profiles")
              .getPublicUrl(`${uid}/${file}`);

            let imageUrl = data.publicUrl;
            const sellerDataToInsert = [
              {
                auth_uid: uid,
                seller_name: firstName + " " + lastName,
                seller_email: emailVal,
                seller_image: imageUrl,
                seller_address: "",
                user_type: "Seller",
              },
            ];
            console.log(sellerDataToInsert);
            const { error } = await supabase
              .from("seller_auth_data")
              .insert(sellerDataToInsert);
            console.log(error);

          }

          setTimeout(() => {
            pushData();
          });
        }
      } else {
        errorState = !errorState;
        errTitle = "File error!";
        errBody = "Please upload any image to sign up.";

        setTimeout(() => {
          errorState = !errorState;
        }, 3000);
      }
    } else {
      errorState = !errorState;
      errTitle = "Wrong Email Format!";
      errBody =
        "Please use only gmail.com, outlook.com, yahoo.com and protonmail.com";

      setTimeout(() => {
        errorState = !errorState;
      }, 3000);
    }
  }
</script>

<div
  transition:fly={{ y: 200 }}
  class="flex min-h-full flex-col justify-center px-6 py-6 lg:px-8"
>
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <!-- <img
      class="mx-auto h-10 w-auto"
      src="https://raw.githubusercontent.com/panchalbhavya2210/e-commerce-try/main/src/lib/Screenshot_2023-10-15_162702-transformed-removebg-preview.png"
      alt="Your Company"
    /> -->
    <h2
      class="mt-0 text-center text-2xl font-medium leading-9 tracking-tight text-gray-900"
    >
      Create New Account
    </h2>
  </div>

  <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6">
      <div class="flexData flex">
        <div>
          <label
            for="fname"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Firstname</label
          >
          <div class="mt-1">
            <input
              id="fname"
              name="fname"
              type="text"
              required
              bind:value={firstName}
              class="font-medium p-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label
            for="lname"
            class="ml-1 block text-sm font-medium leading-6 text-gray-900"
            >Lastname</label
          >
          <div class="mt-1">
            <input
              id="lname"
              name="lname"
              type="text"
              required
              bind:value={lastName}
              class="font-medium ml-1 p-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
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
        <div class="flex items-center justify-between">
          <label
            for="password"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Password</label
          >
        </div>
        <div class="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            bind:value={password}
            class="font-medium p-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
          />
        </div>
        <label
          class="mt-3 block text-sm font-medium text-gray-800"
          for="file_input">Upload file</label
        >
        <input
          class="mt-1 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          type="file"
          bind:files
        />
      </div>
      <div class="flexRadio flex">
        <label>
          <input
            checked
            on:change={onChange}
            type="radio"
            name="amount"
            value="User"
          /> I Am Buyer
        </label>
        <label>
          <input
            class="ml-3"
            checked={selected === 20}
            on:change={onChange}
            type="radio"
            name="amount"
            value="Seller"
          /> I Am Seller
        </label>
      </div>
      <div>
        <button
          type="submit"
          on:click={mainFunction}
          disabled={progressSignUp}
          class="flex w-full {progressSignUp ? 'cursor-pointer' : 'cursor-not-allowed'} justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black hover:transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        >
          <div role="status" class=" {progressSignUp ? 'block' : 'hidden'}">
            <svg
              aria-hidden="true"
              class="w-auto h-6 mr-2 text-gray-200 animate-spin dark:text-gray-700 fill-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
          {progressSignUp ? "Signing Up" : "Sign Up"}</button
        >
      </div>
    </form>

    <p class="mt-10 text-center text-sm text-gray-500">
      Already a ShopAholic?
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
          <p class="font-bold">Success.</p>
          <p class="text-sm break-all">Signed Up successfully.</p>
        </div>
      </div>
    </div>
    <div
      class="bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md max-w-sm w-96 fixed bottom-5 transition-all duration-300 {errorState
        ? 'translate-y-0 opacity-100'
        : 'translate-y-24 opacity-0'}"
      role="alert"
    >
      <div class="flex">
        <div class="py-1">
          <svg
            class="fill-current h-6 w-6 text-red-500 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            ><path
              d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"
            /></svg
          >
        </div>
        <div>
          <p class="font-bold">{errTitle}</p>
          <p class="text-sm break-all">{errBody}</p>
        </div>
      </div>
    </div>
  </div>
</div>
