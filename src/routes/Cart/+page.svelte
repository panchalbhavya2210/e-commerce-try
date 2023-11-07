<script>
  import { onMount } from "svelte";
  import supabase from "../../lib";
  import { get } from "svelte/store";
  import "../../lib/global.css";

  let addArr = [];
  const countMap = {};
  let arrCount = [];
  arrCount = countMap;
  let totalAmount;

  let removerState = false;

  async function getCartData() {
    try {
      const response = await supabase.auth.getUser();
      const authId = response.data.user.id;
      const { data: cartData, error } = await supabase
        .from("CartData")
        .select("*")
        .eq("auth_id", authId);

      const fetchArr = cartData.map((item) => item.product_id);

      fetchArr.forEach((element) => {
        if (countMap[element] && removerState == true) {
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
      totalAmount = 0;
      for (const product of addArr) {
        if (countMap[product.id]) {
          totalAmount += product.product_price * countMap[product.id];
        }
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

    getCartData();
  }
</script>

<main>
  <div class="mt-8 p-10">
    <div class="flow-root">
      <ul role="list" class="-my-6 divide-y divide-gray-200">
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
          <a
            href="#"
            class="flex items-center justify-center rounded-md border border-transparent bg-gray-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-700"
            >Checkout</a
          >
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
