<script>
  import "../../../lib/global.css";
  import { fade, fly } from "svelte/transition";

  /**
   * * Now how to convert obj to arry
   */

  export let data = [];
  // getting value of data and storing
  let product = data;
  //obj to array
  let prd = product.product;

  let prdCategory = prd[0].product_category;
</script>

<main transition:fly={{ y: 200 }}>
  <!-- Breadcrumb -->
  <nav
    class="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 m-3 shadow-md hover:shadow-sm transition-all"
    aria-label="Breadcrumb"
  >
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <a
          href="/"
          class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black"
        >
          <svg
            class="w-3 h-3 mr-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"
            />
          </svg>
          Home
        </a>
      </li>

      <li class="list-none">
        <div class="flex items-center">
          <svg
            class="w-3 h-3 mx-1 text-gray-900"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span class="ml-1 text-sm font-medium text-gray-700 md:ml-2"
            >{prdCategory}</span
          >
        </div>
      </li>
    </ol>
  </nav>

  <!-- {#each prd as product}
    <div class="product">
      <h2>{product.product_name}</h2>
      <p>Category: {product.product_category}</p>
      <p>Description: {product.product_description}</p>
      <p>Price: ${product.product_price}</p>
    </div>
  {/each} -->

  <!-- <section class="">
    <div class="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12">
      <div
        class="grid justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {#each prd as product}
          <a
            rel="noopener noreferrer"
            href="#"
            class="max-w-sm mx-auto group hover:no-underline focus:no-underline"
          >
            <img
              role="presentation"
              class="object-cover w-full rounded h-44 dark:bg-gray-500"
              src="https://source.unsplash.com/random/480x360?1"
            />
            <div class="p-6 space-y-2">
              <h3
                class="text-2xl font-semibold group-hover:underline group-focus:underline"
              >
                {product.product_name}
              </h3>
              <span class="text-xs dark:text-gray-700"
                >{product.product_category}</span
              >
              <p>
                Mei ex aliquid eleifend forensibus, quo ad dicta apeirian
                neglegentur, ex has tantas percipit perfecto. At per tempor
                albucius perfecto, ei probatus consulatu patrioque mea, ei
                vocent delicata indoctum pri.
              </p>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </section> -->

  <div class="categorymenu w-full sm:w-full sm:p-10 md:p-5">
    <div
      class="grid grid-cols-1 gap-5 m-auto sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
    >
      {#each prd as product}
        <div class="rowOne cursor-pointer group transition-all">
          <div class="heightOne h-11/12 shadow-lg p-3">
            <img
              src={product.product_image}
              alt=""
              srcset=""
              class="rounded-md group-hover:scale-105 transition-all h-full w-full"
            />
            <p class="font-medium text-lg break-words mt-2 m-1">
              {product.product_name}
            </p>
            <p class="break-words m-1">
              {product.product_description}
            </p>
            <p class="font-medium m-1">{product.product_price}₹</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</main>
