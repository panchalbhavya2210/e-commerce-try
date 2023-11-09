<script>
  import { onMount } from "svelte";
  import supabase from "../../lib";
  import truck from "../../lib/category-icons/truck.png";
  import "../../lib/global.css";

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
      totalAmount = 0;
      for (const product of addArr) {
        if (countMap[product.id]) {
          totalAmount += product.product_price * countMap[product.id];
        }
      }
      if (totalAmount < 500) {
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

    getCartData();
  }
</script>

<div class="checkout">
  <h1 class="font-medium absolute left-10 mb-4">Products In Cart</h1>

  <div class="mt-8 p-10">
    <div class="productDetails">
      <div class="flow-root">
        <ul role="list" class="-my-6 divide-y divide-gray-200 mt-2">
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
          {#if totalAmount < 500 && totalAmount > 0}
            <li class="flex py-6">
              <div
                class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
              >
                <img
                  src={truck}
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
                      <a href="#">Delivery Charges</a>
                    </h3>
                    <p class="ml-4">50₹</p>
                  </div>
                </div>
                <div class="flex flex-1 items-end justify-between text-sm">
                  <p class="text-gray-500">Quantity 1</p>
                </div>
              </div>
            </li>
          {:else if totalAmount == 0}
            Nothing In cartData
          {:else}
            <h1>Yay! Free Delivery</h1>
          {/if}
        </ul>
      </div>
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
      </div>
    </div>

    <h2 class="mb-5">Fill Out Your Details.</h2>

    <div class="formContainer">
      <div class="form">
        <div class="formFlex flex justify-between">
          <div class="inp flex-1">
            <label for="reciever-first">Recipient's First Name</label>
            <br />
            <input
              name="reciever-first"
              id="reciever-first"
              class="w-full mr-3 p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              type="text"
            />
          </div>
          <div class="inp flex-1">
            <label for="reciever-last">Recipient's Last Name</label>
            <br />
            <input
              name="reciever-last"
              id="reciever-last"
              class="w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              type="text"
            />
          </div>
        </div>

        <div class="inp">
          <label for="reciever-email">Email</label>
          <br />
          <input
            name="reciever-email"
            id="reciever-email"
            class="w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
            type="text"
          />
        </div>

        <div class="formFlex flex justify-between mt-4">
          <div class="inp flex-1">
            <label for="address">Address</label>
            <br />
            <input
              name="address"
              id="address"
              class="w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              type="text"
            />
          </div>
          <div class="inp flex-1">
            <label for="city">City</label>
            <br />
            <input
              name="city"
              id="city"
              class="w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              type="text"
            />
          </div>
        </div>

        <div class="formFlex flex justify-between mt-4">
          <div class="inp flex-1">
            <label for="zip">ZIP Code</label>
            <br />
            <input
              name="zip"
              id="zip"
              class="w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              type="text"
            />
          </div>
          <div class="inp flex-1">
            <label for="phone">Phone Number</label>
            <br />
            <input
              name="phone"
              id="phone"
              class="w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              type="tel"
            />
          </div>
        </div>
      </div>

      <p class="text-red-400 mt-3">Only COD(cash on delivery) Available.</p>

      <div class="button">
        <div class="mt-6">
          <a
            href="#"
            class="flex items-center justify-center rounded-md border border-transparent bg-gray-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-700"
            >Checkout {totalAmount}₹</a
          >
        </div>
      </div>
    </div>
  </div>
</div>
