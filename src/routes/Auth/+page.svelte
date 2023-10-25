<script>
  import supabase from "../../lib/index";
  import "../../lib/global.css";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import eyeOff from "../../lib/assets/eye-off.svg";
  import eyeOn from "../../lib/assets/eye-on.svg";
  import { get } from "svelte/store";

  let selected;
  function onChange(event) {
    selected = event.currentTarget.value;
    console.log(selected);
  }

  async function insertData() {
    try {
      // Replace 'your_table_name' with the actual name of your table
      const { data, error } = await supabase
        .from("seller_auth")
        .insert(dataToInsert); // You can specify specific columns if needed

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        console.log("Data fetched successfully:", data);
        // Process or use the data as needed
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  onMount(() => {
    // insertData();
    async function fetchData() {
      try {
        // Replace 'your_table_name' with the actual name of your table
        const { data, error } = await supabase
          .from("SellerData")
          .select("seller_category, seller_name, seller_products"); // You can specify specific columns if needed

        if (error) {
          console.error("Error fetching data:", error);
        } else {
          console.log("Data fetched successfully:", data);
          // Process or use the data as needed
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
    // fetchData();
  });
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

  // async function getUid() {
  //   const userData = await supabase.auth.getUser();
  //   const getUid = userData.then((response) => {
  //     uid = response.data.user.id;
  //   });
  // }
  // async function createUser() {
  //   const { data, error } = await supabase.auth.signUp({
  //     email: emailVal,
  //     password: password,
  //   });
  // }
  // async function uploadImage() {
  //   let fileName = files[0].name;
  //   let fileIt = files[0];
  // }

  // function mainFunction() {
  //   validateEmail(emailVal);

  //   if (us != null) {
  //     alert(1);
  //     // createUser()
  //     const userData = supabase.auth.getUser();
  //     const getUid = userData.then((response) => {
  //       let uid = response.data.user.id;
  //       console.log(uid);
  //       if (selected == "User") {
  //       }
  //     }).catch((err) => {
  //       console.log(err)
  //     });
  //   } else {
  //   }
  // }

  async function mainFunction() {
    console.log(files[0]);
    let file = files[0].name;
    let fileIt = files[0];

    validateEmail(emailVal);

    if (us != null) {
      const { data, error } = await supabase.auth.signUp({
        email: emailVal,
        password: password,
      });
      const uid = data.user.id;
      if (selected == "User") {
        const { data1, error1 } = supabase.storage
          .from("profiles")
          .upload(`${uid}/${file}`, fileIt);

        const { data } = supabase.storage
          .from("profiles")
          .getPublicUrl(`${uid}/${file}`);

        let imageUrl = data.publicUrl;
        const userDataToInsert = [
          {
            user_name: firstName + " " + lastName,
            user_email: emailVal,
            user_profile: imageUrl,
            user_address: "",
          },
        ];
        console.log(userDataToInsert);
        const { error } = await supabase
          .from("User Data")
          .insert(userDataToInsert);
        console.log(error);
      } else {
        const { data1, error1 } = supabase.storage
          .from("profiles")
          .upload(`${uid}/${file}`, fileIt);

        const { data } = supabase.storage
          .from("profiles")
          .getPublicUrl(`${uid}/${file}`);

        let imageUrl = data.publicUrl;
        const sellerDataToInsert = [
          {
            seller_name: firstName + " " + lastName,
            seller_email: emailVal,
            seller_image: imageUrl,
            seller_address: "",
          },
        ];
        console.log(sellerDataToInsert);
        const { error } = await supabase
          .from("seller_auth")
          .insert(sellerDataToInsert);
        console.log(error);
      }
    } else {
      console.log("Fuck email not valid");
    }
  }
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-6 lg:px-8">
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
          <div class="text-sm underline">
            <a href="#" class="font-semibold text-gray-600 hover:text-black"
              >Forgot password?</a
            >
          </div>
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
            checked={selected === 10}
            on:change={onChange}
            type="radio"
            name="amount"
            value="User"
          /> I Am Buyer
        </label>
        <label>
          <input
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
          class="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black hover:transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >Sign in</button
        >
      </div>
    </form>

    <p class="mt-10 text-center text-sm text-gray-500">
      Already a member?
      <a
        href="/Login"
        class="font-semibold leading-6 text-gray-700 hover:text-black underline"
        >Login</a
      >
    </p>

    <div
      class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md w-96 max-w-sm fixed bottom-5"
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
          <p class="font-bold">Our privacy policy has changed</p>
          <p class="text-sm break-all">Make sure you know how</p>
        </div>
      </div>
    </div>
    <div
      class="bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md max-w-sm w-96 fixed bottom-5"
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
          <p class="font-bold">Our privacy policy has changed</p>
          <p class="text-sm break-all">Make sure you know how</p>
        </div>
      </div>
    </div>
  </div>
</div>
