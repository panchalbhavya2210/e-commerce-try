<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import supabase from "../lib/index";
  let navMobileState, profileView;

  let img;
  let accordionMenu, navShow;
  async function getUidData() {
    let supabaseAuthId = await supabase.auth.getUser().then((response) => {
      let authId = response.data.user.id;

      async function getData() {
        const { data, error } = await supabase
          .from("user_auth_data")
          .select("*")
          .eq("auth_uid", authId);

        if (data && data.length > 0) {
          const rowData = data[0];
          img = rowData.user_profile;
          console.log(img);
          console.log("Fetched row data:", rowData);
        } else {
          console.log("Row not found.");
        }
      }
      getData();
    });
  }
  onMount(() => {
    setTimeout(() => {
      getUidData();
    }, 1500);
  });
</script>

<nav class="bg-gray-200 shadow-sm">
  <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div class="relative flex h-16 items-center justify-between">
      <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
        <!-- Mobile menu button-->
        <button
          type="button"
          class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          aria-controls="mobile-menu"
          aria-expanded="false"
          on:click={() => (navShow = !navShow)}
        >
          <span class="absolute -inset-0.5" />
          <span class="sr-only">Open main menu</span>
          <!--
            Icon when menu is closed.

            Menu open: "hidden", Menu closed: "block"
          -->
          <svg
            width="35px"
            height="35px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="24" height="24" fill="" />
            <path
              d="M14.5 17L9.5 12L14.5 7"
              stroke="#000000"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <!--
            Icon when menu is open.

            Menu open: "block", Menu closed: "hidden"
          -->
          <svg
            class="hidden h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class="flex flex-1 items-center justify-center">
        <div class="flex flex-shrink-0 items-center sm:absolute left-0">
          <a href="/">
            <img
              class="h-8 w-auto"
              src="https://raw.githubusercontent.com/panchalbhavya2210/e-commerce-try/main/src/lib/Screenshot_2023-10-15_162702-transformed-removebg-preview.png"
              alt="Your Company"
            />
          </a>
        </div>
        <div class="hidden sm:ml-6 sm:block">
          <div class="flex space-x-4">
            <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
            <a
              href="/Auth"
              class=" rounded-md px-3 py-2 text-sm font-medium"
              aria-current="page">Sign Up</a
            >
            <a
              href="/Cart"
              class="text-black hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              >Cart</a
            >
            <a
              href=""
              class="text-black hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              >Projects</a
            >
            <a
              href="#"
              class="text-black hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              >Calendar</a
            >
          </div>
        </div>
      </div>
      <div
        class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
      >
        <button
          type="button"
          class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <span class="absolute -inset-1.5" />
          <span class="sr-only">View notifications</span>
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
        </button>

        <!-- Profile dropdown -->
        <div class="relative ml-3">
          <div>
            <button
              type="button"
              class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              id="user-menu-button"
              aria-expanded="false"
              aria-haspopup="true"
              on:click={() => (profileView = !profileView)}
            >
              <span class="absolute -inset-1.5" />
              <span class="sr-only">Open user menu</span>
              <img class="h-8 w-8 rounded-full" src={img} alt="" />
            </button>
          </div>

          <!--
            Dropdown menu, show/hide based on menu state.

            Entering: "transition ease-out duration-100"
              From: "transform opacity-0 scale-95"
              To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
              From: "transform opacity-100 scale-100"
              To: "transform opacity-0 scale-95"
          -->
          <div
            class="absolute right-0 z-50 mt-2 w-48 transition-all {profileView
              ? 'scale-100'
              : 'scale-0'} origin-top-right rounded-md rgba(255, 0 ,0 ,0.8) z-10 py-1 backdrop-blur-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
            tabindex="-1"
          >
            <!-- Active: "bg-gray-100", Not Active: "" -->
            <a
              href="#"
              class="block px-4 py-2 text-sm text-black"
              role="menuitem"
              tabindex="-1"
              id="user-menu-item-0">Your Profile</a
            >
            <a
              href="#"
              class="block px-4 py-2 text-sm text-black"
              role="menuitem"
              tabindex="-1"
              id="user-menu-item-1">Settings</a
            >
            <a
              href="#"
              class="block px-4 py-2 text-sm text-black"
              role="menuitem"
              tabindex="-1"
              id="user-menu-item-2">Sign out</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile menu, show/hide based on menu state. -->
  <!-- <div
    class="sm:hidden duration-500 transition-all {navMobileState
      ? '-translate-y-0'
      : '-translate-y-52 '}"
    id="mobile-menu"
  >
    <div class="space-y-1 px-2 pb-3 pt-2 {navMobileState ? 'block' : 'hidden'}">
      <a
        href="#"
        class=" block rounded-md px-3 py-2 text-base font-medium"
        aria-current="page">Dashboard</a
      >
      <a
        href="#"
        class="text-black hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
        >Team</a
      >
      <a
        href="#"
        class="text-black hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
        >Projects</a
      >
      <a
        href="#"
        class="text-black hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
        >Calendar</a
      >
    </div>
  </div> -->

  <div class="mobileMenu sm:hidden">
    <div
      class="fixedMenu mobileMenu fixed top-0 z-50 h-full w-full bg-gray-200 overflow-scroll transition-all duration-500 {navShow
        ? 'callMenu'
        : 'fixedMenu'}"
    >
      <div class="flex items-center justify-start mt-4">
        <div class="flex justify-between items-center">
          <div class="mx-5">
            <button on:click={() => (navShow = !navShow)}>
              <svg
                width="35px"
                height="35px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="24" height="24" fill="" />
                <path
                  d="M14.5 17L9.5 12L14.5 7"
                  stroke="#000000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
          <a href="/">
            <img
              class="h-8 w-auto -mt-2"
              src="https://raw.githubusercontent.com/panchalbhavya2210/e-commerce-try/main/src/lib/Screenshot_2023-10-15_162702-transformed-removebg-preview.png"
              alt="ShopAholic's Logo"
            />
          </a>
        </div>
      </div>
      <div class="navItems">
        <h2>
          <a href="/">
            <button
              on:click={() => (navShow = !navShow)}
              type="button"
              aria-current={$page.url.pathname === "/" ? "page" : undefined}
              class="{navShow
                ? 'showButton'
                : ''} rounded-none aria buttonClass transition-all duration-500 delay-75 flex items-center justify-between w-full p-5 font-medium text-left text-black border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200"
            >
              <span>Home</span>
            </button>
          </a>
        </h2>
      </div>

      <div id="accordion-collapse" data-accordion="collapse">
        <h2 id="accordion-collapse-heading-1">
          <button
            type="button"
            class="{navShow
              ? 'showButton'
              : ''} buttonClass transition-all duration-500 delay-100 flex items-center justify-between w-full p-5 font-medium text-left text-black border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200"
            data-accordion-target="#accordion-collapse-body-1"
            aria-expanded="true"
            aria-controls="accordion-collapse-body-1"
            on:click={() => (accordionMenu = !accordionMenu)}
          >
            <span>Categories</span>
            <svg
              data-accordion-icon
              class="w-3 h-3 rotate-180 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5 5 1 1 5"
              />
            </svg>
          </button>
        </h2>
        <div
          id="accordion-collapse-body-1"
          class={accordionMenu ? "block" : "hidden"}
          aria-labelledby="accordion-collapse-heading-1"
        >
          <a href="/Category/Electronics">
            <p
              aria-current={$page.url.pathname === "/Category/Electronics"
                ? "page"
                : undefined}
              class="aria mb-1 text-black h-16 flex items-center pl-7"
            >
              Electronics
            </p>
          </a>
          <a href="/Category/Electronics">
            <p
              aria-current={$page.url.pathname === "/Category/"
                ? "page"
                : undefined}
              class="aria mb-1 text-black h-16 flex items-center pl-7"
            >
              Electronics
            </p>
          </a>
          <a href="/Category/Electronics">
            <p
              aria-current={$page.url.pathname === "/Category/"
                ? "page"
                : undefined}
              class="aria mb-1 text-black h-16 flex items-center pl-7"
            >
              Electronics
            </p>
          </a>
        </div>
        <h2>
          <a href="/ProductCreator">
            <button
              on:click={() => (navShow = !navShow)}
              type="button"
              aria-current={$page.url.pathname === "/ProductCreator"
                ? "page"
                : undefined}
              class="{navShow
                ? 'showButton'
                : ''} aria buttonClass transition-all duration-500 delay-150 flex items-center justify-between w-full p-5 font-medium text-left text-black border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200"
            >
              <span>List Your Product</span>
            </button></a
          >
        </h2>
        <h2>
          <a href="/Cart">
            <button
              on:click={() => (navShow = !navShow)}
              type="button"
              aria-current={$page.url.pathname === "/Cart" ? "page" : undefined}
              class="{navShow
                ? 'showButton'
                : ''} aria buttonClass transition-all duration-500 delay-200 flex items-center justify-between w-full p-5 font-medium text-left text-black border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200"
            >
              <span>Your Cart</span>
            </button></a
          >
        </h2>
        <h2>
          <a href="/Profile">
            <button
              on:click={() => (navShow = !navShow)}
              type="button"
              class="{navShow
                ? 'showButton'
                : ''} buttonClass transition-all duration-500 delay-300 flex items-center justify-between w-full p-5 font-medium text-left text-black border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200"
            >
              <span>Your Profile</span>
            </button></a
          >
        </h2>
      </div>
    </div>
  </div>
</nav>

<style>
  .mobileMenu::-webkit-scrollbar {
    display: none;
  }
  .aria[aria-current="page"] {
    color: #ffffff;
    background-color: #000000;
  }
  .fixedMenu {
    margin-left: -100%;
    transition: 0.5s;
  }
  .callMenu {
    margin-left: 0;
  }
  .buttonClass {
    transform: translateY(10px);
    opacity: 0;
    transition: 1s;
  }
  .showButton {
    transition-delay: 0.3s;
    transform: translateY(0);
    opacity: 100;
  }
</style>
