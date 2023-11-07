<script>
  import supabase from "../../../lib";
  import "../../../lib/global.css";
  import { fade, fly } from "svelte/transition";

  /**
   * * Now how to convert obj to arry
   */

  export let data = [];
  let product = data;
  let prd = product.product;
  //obj to array
  let prdCategory;
  console.log(data);

  console.log();

  if (data.product.length != 0) {
    prdCategory = prd[0].product_category;
  } else {
    console.log("it is what it is");
  }

  let array = [];
  let prd_qt = [];

  async function addCart(prd) {
    let supabaseAuthId = await supabase.auth.getUser().then((response) => {
      let authId = response.data.user.id;

      array.push(prd.id);
      prd_qt.push("1");

      let cartDataToInsert = {
        auth_id: authId,
        product_id: prd.id,
        product_qty: 1,
      };
      async function road() {
        const { data, error } = await supabase
          .from("CartData")
          .insert(cartDataToInsert);
      }
      road();
    });
  }
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

  <div class="categorymenu w-full sm:w-full sm:p-10 md:p-5">
    <div
      class="grid grid-cols-1 gap-5 m-auto sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
    >
      {#each prd as product}
        <div class="rowOne cursor-pointer group transition-all">
          <div class="heightOne h-11/12 shadow-lg p-3">
            <img
              src={product.product_image_d}
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
            <div class="flex justify-between">
              <p class="font-medium m-1">{product.product_price}₹</p>
              <button
                on:click={() => addCart(product)}
                type="button"
                class="text-white -mt-1.5 bg-black focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 hover:bg-gray-700"
                ><svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z"
                    stroke="#ffffff"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg></button
              >
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</main>
