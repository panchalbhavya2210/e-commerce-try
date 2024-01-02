<script>
  import { onMount } from "svelte";
  import supabase from "../../lib";
  import truck from "../../lib/category-icons/truck.png";
  import empty from "../../lib/category-icons/cart-mt.png";
  import "../../lib/global.css";
  import done from "../../lib/assets/done-round-svgrepo-com.svg";
  import error from "../../lib/assets/error.svg";
  import { loadStripe } from "@stripe/stripe-js";

  // src/routes/api/sendEmail.js
  // Your client-side code (e.g., in a Svelte component)

  let addArr = [];
  let arrCount = [];
  let totalAmount;
  let prdId = [];
  let seller_id = [];
  let product_name = [],
    product_desc = [],
    product_price = [],
    product_img = [];
  let user_email;
  let user_id, orderConfirmation, ocTemp, orderError;

  let removerState = false;

  async function getCartData() {
    try {
      const countMap = {};
      arrCount = countMap;

      const response = await supabase.auth.getUser();
      const authId = response.data.user.id;
      user_id = response.data.user.id;
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
      console.log(countMap);

      const { data: productData } = await supabase
        .from("ProductData")
        .select("*")
        .in("id", fetchArr);

      addArr = productData;
      console.log(addArr);

      for (let i = 0; i < addArr.length; i++) {
        product_name.push(productData[i].product_name);
        product_desc.push(productData[i].product_description);
        product_price.push(productData[i].product_price);
        product_img.push(productData[i].product_image_d);
        prdId.push(productData[i].id);
        seller_id.push(productData[i].seller_id);
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
      console.log(arrCount);
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

  let recFName, recLName, recEmail, recCity, recAddres, recPin, recPhone;
  async function order() {
    const randomDecimal = Math.random();
    const otp = Math.floor(randomDecimal * 1000000);
    for (let i = 0; i < seller_id.length; i++) {
      const orderDataToInsert = {
        customer_name: recFName + " " + recLName,
        customer_address: recAddres,
        customer_phone: recPhone,
        customer_city: recCity,
        customer_pin: recPin,
        customer_email: recEmail,
        seller_id: seller_id[i],
        product_ids: prdId[i],
        user_id: user_id,
        product_name: product_name[i],
        product_desc: product_desc[i],
        product_image: product_img[i],
        product_price: product_price[i],
        order_status: "Pending",
        customer_otp: otp,
        ordered_qty: arrCount[prdId[i]],
        invoice_amt: totalAmount,
      };
      console.log(orderDataToInsert);
      const { data, error } = await supabase
        .from("order_table")
        .insert(orderDataToInsert);

      for (let i = 0; i < prdId.length; i++) {
        const { data: deleted } = await supabase
          .from("CartData")
          .delete()
          .eq("product_id", prdId[i]);
      }
      ocTemp = error;
      console.log(data, error);
    }
    if (ocTemp == null && addArr.length != 0) {
      orderConfirmation = !orderConfirmation;
      setTimeout(() => {
        orderConfirmation = !orderConfirmation;
      }, 5000);
    } else if (addArr.length == 0) {
      orderError = !orderError;
      setTimeout(() => {
        orderError = !orderError;
      }, 5000);
    } else {
      alert("Something Went Wrong");
    }
  }

  async function checkout() {
    const response = await fetch("/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: addArr,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      window.location.replace(data.url);
    } else {
      // Handle error or display an appropriate message
      console.error("Error during checkout:", response.statusText);
    }
  }

  // const data = null;

  // fetch(
  //   `https://anyapi.io/${apiKey}/v1/invoice/generate?date=22/10/2001&number=1&from=AnyAPI&from_address=1&to=Acme%2C%20Corp&ship_to=1&name=USB&unit_cost=50&quantity=2&logo=https%3A%2F%2Fanyapi.io%2Fassets%2Flogo.png&currency=inr&due_date=22/10/2001&tax=8&amount_paid=10&notes=Bhavyakey`,
  //   {
  //     method: "GET",
  //     credentials: "include",
  //     headers: {
  //       Authorization: `Bearer ${apiKey}`,
  //       // Add any other headers if required
  //     },
  //   }
  // )
  //   .then((response) => {
  //     console.log(response);
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  //     return response.text();
  //   })
  //   .then((data) => {
  //     console.log(data);
  //   })
  //   .catch((error) => {
  //     console.error("Fetch error:", error);
  //   });
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
                  alt=""
                  class="h-full w-full object-cover object-center"
                />
              </div>
              <div class="ml-4 flex flex-1 flex-col">
                <div>
                  <div
                    class="flex justify-between text-base font-medium text-gray-900"
                  >
                    <h3>
                      <p>{con.product_name}</p>
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
                  alt=""
                  class="h-full w-full object-cover object-center"
                />
              </div>
              <div class="ml-4 flex flex-1 flex-col">
                <div>
                  <div
                    class="flex justify-between text-base font-medium text-gray-900"
                  >
                    <h3>
                      <a href="a">Delivery Charges</a>
                    </h3>
                    <p class="ml-4">50₹</p>
                  </div>
                </div>
                <div class="flex flex-1 items-end justify-between text-sm">
                  <p class="text-gray-500">Quantity 1</p>
                </div>
              </div>
            </li>
          {:else if totalAmount == 0 && addArr.length == 0}
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
        <div class="inp mb-5">
          <label for="reciever-email">Email</label>
          <br />
          <input
            bind:value={recEmail}
            name="reciever-email"
            id="reciever-email"
            class="w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
            type="text"
            required
          />
        </div>
        <div class="formFlex flex justify-between">
          <div class="inp flex-1">
            <label for="reciever-first">Recipient's First Name</label>
            <br />
            <input
              bind:value={recFName}
              name="reciever-first"
              id="reciever-first"
              class="w-11/12 mr-5 p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              type="text"
              minlength="3"
              required
            />
          </div>
          <div class="inp flex-1">
            <label class="ml-2 sm:ml-12 md:ml-12 lg:ml-12" for="reciever-last"
              >Recipient's Last Name</label
            >
            <br />
            <input
              bind:value={recLName}
              name="reciever-last"
              id="reciever-last"
              class="w-11/12 ml-2 sm:ml-12 md:ml-12 lg:ml-12 p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              type="text"
              required
              minlength="3"
            />
          </div>
        </div>
        <div class="formFlex flex justify-between mt-4">
          <div class="inp flex-1">
            <label for="address">Address</label>
            <br />
            <input
              bind:value={recAddres}
              name="address"
              id="address"
              class="w-11/12 mr-3 p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              type="text"
              minlength="10"
              required
            />
          </div>
          <div class="inp flex-1">
            <label class="ml-2 sm:ml-12 md:ml-12 lg:ml-12" for="city"
              >City</label
            >
            <br />
            <input
              bind:value={recCity}
              name="city"
              id="city"
              class="w-11/12 ml-2 sm:ml-12 md:ml-12 lg:ml-12 p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              type="text"
              required
              minlength="2"
            />
          </div>
        </div>
        <div class="formFlex flex justify-between mt-4">
          <div class="inp flex-1">
            <label for="zip">ZIP Code</label>
            <br />
            <input
              bind:value={recPin}
              name="zip"
              id="zip"
              class="w-11/12 mr-3 p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              type="number"
              minlength="3"
              required
            />
          </div>
          <div class="inp flex-1">
            <label class="ml-2 sm:ml-12 md:ml-12 lg:ml-12" for="phone"
              >Phone Number</label
            >
            <br />
            <input
              bind:value={recPhone}
              name="phone"
              id="phone"
              class="w-11/12 ml-2 sm:ml-12 md:ml-12 lg:ml-12 p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              type="tel"
              minlength="6"
              required
            />
          </div>
        </div>
      </div>
      <p class="text-red-400 mt-3">Only COD(cash on delivery) Available.</p>
      <div class="button">
        <div class="mt-6">
          <a
            on:click={checkout}
            href=""
            class="flex items-center justify-center rounded-md border border-transparent bg-gray-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-700"
            >Checkout {totalAmount}₹</a
          >
        </div>
      </div>
    </div>
  </div>

  <div
    class="checkMarkAnimation w-96 h-16 bg-green-200 fixed bottom-0 ml-2 sm:m-10 md:m-10 lg:m-10 rounded-md transition-all duration-300 shadow-md flex items-center justify-start {orderConfirmation
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-20'}"
  >
    <img src={done} class="w-auto h-8 mx-5" alt="" />
    <div>
      <p class="font-semibold text-green-700">Thanks! Order Placed.</p>
      <p class="font-medium text-green-700">
        View
        <a href="/OrderStatus" class="underline">Order Status</a>
        .
      </p>
    </div>
  </div>
  <div
    class="checkMarkAnimation w-96 h-16 bg-red-200 fixed bottom-0 ml-2 sm:m-10 md:m-10 lg:m-10 rounded-md transition-all duration-300 shadow-md flex items-center justify-start {orderError
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-20'}"
  >
    <img src={error} class="w-auto h-8 mx-5" alt="" />
    <div>
      <p class="font-semibold text-red-700">Nothing In Cart.</p>
      <p class="font-medium text-red-700">
        Add
        <a href="/" class="underline">Products</a>
        First.
      </p>
    </div>
  </div>
</div>
