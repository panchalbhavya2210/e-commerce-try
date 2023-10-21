<script>
  import supabase from "../../lib/index";
  import "../../lib/global.css";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import eyeOff from "../../lib/assets/eye-off.svg";
  import eyeOn from "../../lib/assets/eye-on.svg";

  let showText = true;
  let eyeClick;
  let textValue = "";
  let passwordValue = "";
  let inputType = "text";

  function toggleInputType() {}
  function changeType() {
    inputType = inputType === "text" ? "password" : "text";
    eyeClick = !eyeClick;
    showText = !showText;
  }

  const dataToInsert = [
    {
      seller_name: "Hello",
      seller_email: "hello@gmail.com",
      seller_image: "pmg",
      seller_category: ["none", "none", "none"],
      seller_products: ["none", "none", "none"],
      seller_price: "2000",
      seller_address: "confidential",
    },
  ];

  async function insertData() {
    const { data, error } = await supabase
      .from("SellerData")
      .upsert(dataToInsert);

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully:", data);
    }
  }
  // insertData();
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
  let emailVal = "panchalbhavya2210@protonmail.com";

  // function checkRegex() {
  //   let regex = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";
  //   console.log(emailVal);

  //   if(emailVal)
  // }
  const validateEmail = (email) => {
    let us = String(email)
      .toLowerCase()
      .match(
        /\b[A-Za-z0-9._%+-]+@(gmail\.com|outlook\.com|yahoo\.com|protonmail\.com)\b/
      );

    return us;
  };
  validateEmail(emailVal);
</script>

<!--
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
-->
<!--
  This example requires updating your template:

  ```
  <html class="h-full bg-white">
  <body class="h-full">
  ```
-->
<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img
      class="mx-auto h-10 w-auto"
      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
      alt="Your Company"
    />
    <h2
      class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
    >
      Sign in to your account
    </h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6" action="#" method="POST">
      <div>
        <label
          for="email"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Email address</label
        >
        <div class="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
          <div class="text-sm">
            <a
              href="#"
              class="font-semibold text-indigo-600 hover:text-indigo-500"
              >Forgot password?</a
            >
          </div>
        </div>
        <div class="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >Sign in</button
        >
      </div>
    </form>

    <p class="mt-10 text-center text-sm text-gray-500">
      Not a member?
      <a
        href="#"
        class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >Start a 14 day free trial</a
      >
    </p>
  </div>
</div>
