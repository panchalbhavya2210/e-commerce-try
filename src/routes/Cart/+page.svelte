<script>
  import { onMount } from "svelte";
  import supabase from "../../lib";
  import { get } from "svelte/store";
  import truck from "../../lib/category-icons/truck.png";
  import empty from "../../lib/category-icons/cart-mt.png";
  import "../../lib/global.css";
  let hiddenState = true;

  let addArr = [];
  let arrCount = [];
  let totalAmount;

  let removerState = false;

  async function getCartData() {
    try {
      const countMap = {};
      arrCount = countMap;

      const response = await supabase.auth.getUser();
      const authId = response.data.user.id;
      const { data: cartData, error } = await supabase
        .from("CartData")
        .select("*")
        .eq("auth_id", authId);

      const fetchArr = cartData.map((item) => item.product_id);

      fetchArr.forEach((element) => {
        if (countMap[element] || removerState == true) {
          countMap[element]++;
        } else {
          countMap[element] = 1;
        }
      });

      for (const key in countMap) {
        if (countMap[key] > 1) {
        }
      }

      const { data: productData } = await supabase
        .from("ProductData")
        .select("*")
        .in("id", fetchArr);

      addArr = productData;
      console.log(addArr);
      if (addArr == null || addArr.length == 0) {
        hiddenState = false;
      }
      totalAmount = 0;

      for (const product of addArr) {
        if (countMap[product.id]) {
          totalAmount += product.product_price * countMap[product.id];
        }
      }
      if (totalAmount < 500 && addArr.length != 0) {
        totalAmount = totalAmount + 50;
      } else {
        totalAmount = totalAmount;
      }
    } catch (error) {}
  }

  onMount(() => {
    getCartData();
  });

  async function deleteItem(con) {
    if (removerState == true) {
      removerState = false;
    } else {
      removerState = false;
    }
    const { error } = await supabase
      .from("CartData")
      .delete()
      .eq("product_id", con.id);

    if (error == null) {
      const { data, error } = await supabase
        .from("ProductData")
        .update({
          product_qty: con.product_qty + arrCount[con.id],
        })
        .eq("id", con.id);
    }

    getCartData();
  }
</script>

<main>
  <div class="mt-8 p-10">
    <div class="flow-root">
      <ul role="list" class="-my-6 divide-y divide-gray-200">
        {#if hiddenState == true}
          <div
            role="status"
            class="space-y-8 p-10 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
          >
            <div
              class="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700"
            >
              <svg
                class="w-10 h-10 text-gray-200 dark:text-gray-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path
                  d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"
                />
              </svg>
            </div>
            <div class="w-full">
              <div
                class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-400 w-48 mb-4"
              />
              <div
                class="h-2 bg-gray-200 rounded-full dark:bg-gray-400 max-w-[480px] mb-2.5"
              />
              <div
                class="h-2 bg-gray-200 rounded-full dark:bg-gray-400 mb-2.5"
              />
              <div
                class="h-2 bg-gray-200 rounded-full dark:bg-gray-400 max-w-[440px] mb-2.5"
              />
              <div
                class="h-2 bg-gray-200 rounded-full dark:bg-gray-400 max-w-[460px] mb-2.5"
              />
              <div
                class="h-2 bg-gray-200 rounded-full dark:bg-gray-400 max-w-[360px]"
              />
            </div>
            <span class="sr-only">Loading...</span>
          </div>
        {:else}
          {#each addArr as con (con.id)}
            <li class="flex py-6">
              <div
                class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
              >
                <img
                  src={con.product_image_d}
                  alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
                  class="h-full w-full object-cover object-center"
                />
              </div>
              <div class="ml-4 flex flex-1 flex-col">
                <div>
                  <div
                    class="flex justify-between text-base font-medium text-gray-900"
                  >
                    <h3>
                      <a href="#">{con.product_name}</a>
                    </h3>
                    <p class="ml-4">{con.product_price}₹</p>
                  </div>
                </div>
                <div class="flex flex-1 items-end justify-between text-sm">
                  <p class="text-gray-500">
                    Quantity {arrCount[con.id] || 0}
                  </p>

                  <div class="flex">
                    <button
                      on:click={() => deleteItem(con)}
                      type="button"
                      class="font-medium text-indigo-600 hover:text-indigo-500"
                      >Remove</button
                    >
                  </div>
                </div>
              </div>
            </li>
          {/each}
        {/if}
        {#if (totalAmount == 0 && addArr.length == 0) || hiddenState == false}
          <li class="flex py-6 items-center">
            <div class="h-40 w-auto flex-shrink-0 overflow-hidden rounded-md">
              <img
                src={empty}
                alt=""
                class="h-full w-full object-cover object-center"
              />
            </div>

            <h1 class="ml-5 font-semibold">Your Cart Is Empty.</h1>
          </li>
          <!-- svelte-ignore empty-block -->
        {:else}{/if}
      </ul>
    </div>
    <div
      class="relative z-10 mt-10"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
        <div class="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>₹{totalAmount}</p>
        </div>
        <p class="mt-0.5 text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>
        <div class="mt-6">
          {#if totalAmount == 0 && addArr.length == 0}
            <a
              href="/"
              class="flex items-center justify-center rounded-md border border-transparent bg-gray-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-700"
              >Add Product
            </a>
          {:else}
            <a
              href="/Checkout"
              class="flex items-center justify-center rounded-md border border-transparent bg-gray-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-700"
              >Checkout
            </a>
          {/if}
        </div>
        <div class="mt-6 flex justify-center text-center text-sm text-gray-500">
          <p>
            or
            <button
              type="button"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Continue Shopping
              <span aria-hidden="true"> &rarr;</span>
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</main>
