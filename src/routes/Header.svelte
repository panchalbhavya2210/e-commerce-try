<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import supabase from "../lib/index";
  import person from "../lib/assets/person-svgrepo-com.svg";

  // const SibApiV3Sdk = require("@getbrevo/brevo");
  // import "./brevo";

  let navMobileState, profileView, dropdown, loginState;

  let img = person;
  let accordionMenu, navShow;
  let userType, rowDataif;
  async function getUidData() {
    let supabaseAuthId = await supabase.auth
      .getUser()
      .then((response) => {
        let authId = response.data.user.id;
        async function getData() {
          const { data, error } = await supabase
            .from("user_auth_data")
            .select("*")
            .eq("auth_uid", authId);
          const { data: seller, error: serror } = await supabase
            .from("seller_auth_data")
            .select("*")
            .eq("auth_uid", authId);

          if (error == null || serror == null) {
            loginState = !loginState;
          }

          if (data && data.length > 0) {
            const rowData = data[0];
            img = rowData.user_profile;
            userType = rowData.user_type;
          } else if (seller && seller.length > 0) {
            const rowData = seller[0];
            img = rowData.seller_image;
            userType = rowData.user_type;
          } else {
            rowDataif = 0;
          }
        }
        getData();
      })
      .catch((error) => {
        if (error.message == "Cannot read properties of null (reading 'id')") {
        }
      });
  }
  onMount(() => {
    setTimeout(() => {
      getUidData();
    }, 1500);
  });

  async function signOut() {
    userType = undefined;
    const { error } = await supabase.auth.signOut();
    img = person;
    loginState = false;
  }
</script>

<nav class="bg-gray-200 shadow-sm">
  <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div class="relative flex h-16 items-center justify-between">
      <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
        <button
          type="button"
          class="rotate-180 relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          aria-controls="mobile-menu"
          aria-expanded="false"
          on:click={() => (navShow = !navShow)}
        >
          <span class="absolute -inset-0.5" />
          <span class="sr-only">Open main menu</span>

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
        <div class="hidden sm:ml-24 sm:block">
          <div class="flex justify-center space-x-3">
            <a
              href="/"
              class="sm:hidden rounded-md px-3 py-2 text-sm font-medium"
              aria-current="page">Home</a
            >
            {#if userType == undefined}
              <a
                href="/Auth"
                class=" rounded-md px-3 py-2 text-sm font-medium"
                aria-current="page">Sign Up</a
              >
              <a
                href="/Login"
                class=" rounded-md px-3 py-2 text-sm font-medium"
                aria-current="page">Login</a
              >
            {:else}
              <a
                href="/ProfilePage"
                class=" rounded-md px-3 py-2 text-sm font-medium"
                aria-current="page">My Profile</a
              >
            {/if}

            {#if userType == "User"}
              <a
                href="/Cart"
                class="text-black hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >Cart</a
              >
              <a
                href="/OrderStatus"
                class="text-black hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >Your Order</a
              >
            {:else if userType == ""}
              <!--  -->
            {:else}
              <a
                href="/Cart"
                class="hidden text-black hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >Cart</a
              >
            {/if}

            {#if userType == "User"}
              <a
                href="/Checkout"
                class="text-black hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >Checkout</a
              >
            {:else if userType == undefined}
              <a
                href="/Checkout"
                class="hidden text-black hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >Checkout</a
              >
              <!--  -->
            {:else}
              <a
                href="/ProductCreator"
                class="text-black hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >Sell Product</a
              >
            {/if}
          </div>
        </div>
      </div>
      <div
        class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
      >
        <div class="relative ml-3">
          <div>
            <button
              type="button"
              class="relative flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
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
              href="ProfilePage"
              class="block px-4 py-2 text-sm text-black"
              role="menuitem"
              tabindex="-1"
              id="user-menu-item-0">Your Profile</a
            >
            <!--  -->
            <button
              on:click={signOut}
              class="block px-4 py-2 text-sm text-black"
              role="menuitem"
              tabindex="-1"
              id="user-menu-item-2">Sign out</button
            >
          </div>
        </div>
      </div>
    </div>
  </div>

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
        <h2>
          {#if userType == null || userType == undefined}
            <a href="/Auth">
              <button
                on:click={() => (navShow = !navShow)}
                type="button"
                aria-current={$page.url.pathname === "/Auth"
                  ? "page"
                  : undefined}
                class="{navShow
                  ? 'showButton'
                  : ''} rounded-none aria buttonClass transition-all duration-500 delay-75 flex items-center justify-between w-full p-5 font-medium text-left text-black border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200"
              >
                <span>Create Your Account</span>
              </button>
            </a>
          {:else}
            <a href="/Auth" class="hidden">
              <button
                on:click={() => (navShow = !navShow)}
                type="button"
                aria-current={$page.url.pathname === "/Auth"
                  ? "page"
                  : undefined}
                class="{navShow
                  ? 'showButton'
                  : ''} rounded-none aria buttonClass transition-all duration-500 delay-75 flex items-center justify-between w-full p-5 font-medium text-left text-black border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200"
              >
                <span>Create Your Account</span>
              </button>
            </a>
          {/if}
        </h2>
      </div>

      <div>
        <h2>
          {#if userType == "User"}
            <a href="/Checkout">
              <button
                on:click={() => (navShow = !navShow)}
                type="button"
                aria-current={$page.url.pathname === "/Checkout"
                  ? "page"
                  : undefined}
                class="{navShow
                  ? 'showButton'
                  : ''} aria buttonClass transition-all duration-500 delay-150 flex items-center justify-between w-full p-5 font-medium text-left text-black border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200"
              >
                <span>Checkout</span>
              </button></a
            >
          {:else if userType == "Seller"}
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
          {/if}
        </h2>
        <h2>
          {#if userType == "User"}
            <a href="/Cart">
              <button
                on:click={() => (navShow = !navShow)}
                type="button"
                aria-current={$page.url.pathname === "/Cart"
                  ? "page"
                  : undefined}
                class="{navShow
                  ? 'showButton'
                  : ''} aria buttonClass transition-all duration-500 delay-200 flex items-center justify-between w-full p-5 font-medium text-left text-black border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200"
              >
                <span>Your Cart</span>
              </button></a
            >
            <a href="/OrderStatus">
              <button
                on:click={() => (navShow = !navShow)}
                type="button"
                aria-current={$page.url.pathname === "/OrderStatus"
                  ? "page"
                  : undefined}
                class="{navShow
                  ? 'showButton'
                  : ''} aria buttonClass transition-all duration-500 delay-200 flex items-center justify-between w-full p-5 font-medium text-left text-black border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200"
              >
                <span>Your Order</span>
              </button></a
            >
          {:else}
            <a href="/Cart" class="hidden">
              <button
                on:click={() => (navShow = !navShow)}
                type="button"
                aria-current={$page.url.pathname === "/Cart"
                  ? "page"
                  : undefined}
                class="{navShow
                  ? 'showButton'
                  : ''} aria buttonClass transition-all duration-500 delay-200 flex items-center justify-between w-full p-5 font-medium text-left text-black border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200"
              >
                <span>Your Cart</span>
              </button></a
            >
          {/if}
        </h2>
        <h2>
          <a href="/ProfilePage">
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
        <h2>
          {#if userType == null || userType == undefined}
            <a href="/Login">
              <button
                on:click={() => (navShow = !navShow)}
                type="button"
                aria-current={$page.url.pathname === "/Login"
                  ? "page"
                  : undefined}
                class="{navShow
                  ? 'showButton'
                  : ''} rounded-none aria buttonClass transition-all duration-500 delay-75 flex items-center justify-between w-full p-5 font-medium text-left text-black border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200"
              >
                <span>Login</span>
              </button>
            </a>
          {:else}
            <button
              on:click={signOut}
              type="button"
              aria-current={$page.url.pathname === "/Auth" ? "page" : undefined}
              class="{navShow
                ? 'showButton'
                : ''} rounded-none aria buttonClass transition-all duration-500 delay-75 flex items-center justify-between w-full p-5 font-medium text-left text-black border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200"
            >
              <span>Sign Out</span>
            </button>
          {/if}
        </h2>
      </div>
    </div>
  </div>
</nav>

<div
  class="fixed {loginState
    ? '-bottom-40'
    : 'bottom-0'}  transition-all left-0 w-full flex justify-center"
>
  <div
    class="beta bg-gray-200 rounded-t-md rounded-tr-md p-3 flex items-center"
  >
    <p class="font-semibold">Not Logged In Yet!</p>
    <a href="/Login">
      <button class="bg-gray-700 text-white p-1 px-2 rounded-md ml-2"
        >Log In</button
      ></a
    >
    <a href="/Auth">
      <button class="bg-gray-700 text-white p-1 px-2 rounded-md ml-2"
        >Sign Up</button
      >
    </a>
  </div>
</div>

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
