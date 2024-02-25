<script>
  import { onMount } from "svelte";
  import supabase from "../../lib";
  import truck from "../../lib/category-icons/truck.png";
  import empty from "../../lib/category-icons/cart-mt.png";
  import "../../lib/global.css";
  import done from "../../lib/assets/done-round-svgrepo-com.svg";
  import error from "../../lib/assets/error.svg";

  let addArr = [];
  let arrCount = [];
  let totalAmount;
  let prdId = [];
  let seller_id = [];
  let product_name = [],
    product_desc = [],
    product_price = [],
    product_img = [],
    prdQty = [],
    addressData = [],
    addressForm,
    changePayment,
    addRessLoad,
    orderStat;
  let user_email;
  let user_id, orderConfirmation, ocTemp, orderError;

  function changePaymentFunction(event) {
    changePayment = event.currentTarget.value;
    console.log(changePayment);
  }

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

      const { data: addressDataBeta, error: addressError } = await supabase
        .from("address_data")
        .select("*")
        .eq("user_id", authId);
      console.log(addressData, addressError);
      addressData = addressDataBeta;
      console.log(addressData);

      if (
        addressData == null ||
        addressData == undefined ||
        addressData.length == 0
      ) {
        console.log("no address exists");
      } else {
        //do none
      }

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
      if (totalAmount < 100 && addArr.length != 0) {
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
    console.log(con.product_qty);
    console.log(arrCount[con.id]);
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
        .eq("id", prdId);
    }
    getCartData();
  }

  let recFName,
    recLName,
    recEmail,
    recCity,
    recAddres,
    recPin,
    recPhone,
    recType;

  async function addAddressData() {
    console.log(recAddres);
    if (
      recFName == undefined &&
      recLName == undefined &&
      recEmail == undefined &&
      recCity == undefined &&
      recAddres == undefined &&
      recPin == undefined &&
      recPhone == undefined &&
      recType == undefined
    ) {
      alert("Please fill all the fields");
    } else {
      addRessLoad = !addRessLoad;
      const addressDataCont = {
        user_id: user_id,
        reciever_name: recFName + " " + recLName,
        rec_city: recCity,
        address_title: recType,
        address_details: recAddres,
        pin_code: recPin,
        user_phone: recPhone,
      };
      const { data, error } = await supabase
        .from("address_data")
        .insert(addressDataCont);
      console.log(data, error);
      getCartData();
      if (error == null) {
        addRessLoad = !addRessLoad;
      }
    }
  }
  async function onlinePay() {
    const response = await fetch("/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: addArr,
        countMap: arrCount,
        totalAmt: totalAmount,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      window.location.replace(data.sessionData.url);
    } else {
      console.error("Error during checkout:", response.statusText);
    }
  }
  function checkout() {
    if (changePayment == "cod") {
      window.location.replace("/success");
      orderStat = !orderStat;
      setTimeout(() => {
        orderStat = !orderStat;
      }, 5000);
    } else {
      orderStat = !orderStat;
      setTimeout(() => {
        orderStat = !orderStat;
      }, 5000);
      onlinePay();
    }
  }

  function thisFunc() {
    addressForm = !addressForm;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
</script>

<div class="checkout">
  <h1 class="font-medium absolute left-10 mb-4">Products In Cart</h1>
  <div class="mt-8 p-6">
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
          {#if totalAmount < 100 && totalAmount > 0}
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
                  <p class="text-red-500">
                    Note: Pay delivery charge when parcel arrives.
                  </p>
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

    {#if addressData == null || addressData.length == 0 || addressData == undefined}
      <h1>No Addresses Available</h1>
    {:else}
      <h1 class="mt-2">Availabe Addresses</h1>
      {#each addressData as data}
        <div class="">
          <div class="radioData">
            <div
              class="full w-full my-2 border-black border rounded-md flex justify-start"
            >
              <div class="data mt-2 ml-5 mb-2">
                <p class="font-semibold">{data.address_title}</p>
                <p>{data.reciever_name}</p>
                <p>{data.address_details}</p>
                <p>{data.rec_city}</p>
                <p>{data.user_phone}</p>
                <p>{data.pin_code}</p>
              </div>
            </div>
          </div>
        </div>
      {/each}
    {/if}

    <div class="">
      <div class="radioData">
        <button
          on:click={thisFunc}
          class="full w-full my-2 border-black border bg-gray-300 rounded-md flex items-center justify-start py-2"
        >
          <svg
            class="w-5 h-5 mx-5"
            viewBox="0 -0.5 21 21"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            fill="#000000"
            ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g><g id="SVGRepo_iconCarrier">
              <title>plus_circle [#1427]</title>
              <desc>Created with Sketch.</desc> <defs> </defs>
              <g
                id="Page-1"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <g
                  id="Dribbble-Light-Preview"
                  transform="translate(-179.000000, -600.000000)"
                  fill="#000000"
                >
                  <g id="icons" transform="translate(56.000000, 160.000000)">
                    <path
                      d="M137.7,450 C137.7,450.552 137.2296,451 136.65,451 L134.55,451 L134.55,453 C134.55,453.552 134.0796,454 133.5,454 C132.9204,454 132.45,453.552 132.45,453 L132.45,451 L130.35,451 C129.7704,451 129.3,450.552 129.3,450 C129.3,449.448 129.7704,449 130.35,449 L132.45,449 L132.45,447 C132.45,446.448 132.9204,446 133.5,446 C134.0796,446 134.55,446.448 134.55,447 L134.55,449 L136.65,449 C137.2296,449 137.7,449.448 137.7,450 M133.5,458 C128.86845,458 125.1,454.411 125.1,450 C125.1,445.589 128.86845,442 133.5,442 C138.13155,442 141.9,445.589 141.9,450 C141.9,454.411 138.13155,458 133.5,458 M133.5,440 C127.70085,440 123,444.477 123,450 C123,455.523 127.70085,460 133.5,460 C139.29915,460 144,455.523 144,450 C144,444.477 139.29915,440 133.5,440"
                      id="plus_circle-[#1427]"
                    >
                    </path>
                  </g>
                </g>
              </g>
            </g></svg
          >
          Add New Address
        </button>
      </div>
    </div>
  </div>
  <div class="method px-6">
    <h1>Select Payment Method</h1>
    <div class="radioData mt-2">
      <input
        type="radio"
        name="on"
        id="cash"
        on:change={changePaymentFunction}
        value="cod"
      />
      <label for="cash">Cash On Delivery</label>
      <br />
      <input
        type="radio"
        name="on"
        id="on"
        on:change={changePaymentFunction}
        value="on"
      />
      <label for="on">Online Payment(Card)</label>
    </div>

    <div class="button">
      <div class="mt-6">
        <button
          on:click={checkout}
          disabled={addressData == undefined ||
            addressData.length == 0 ||
            addressData == null}
          class="flex {addressData == undefined ||
          addressData.length == 0 ||
          addressData == null
            ? 'cursor-not-allowed'
            : 'cursor-pointer'} items-center justify-center rounded-md border border-transparent bg-gray-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-700"
        >
          <div class={orderStat ? "block" : "hidden"}>
            <div role="status">
              <svg
                aria-hidden="true"
                class="w-auto h-6 mr-2 text-gray-200 animate-spin dark:text-gray-700 fill-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          </div>
          Checkout {totalAmount}₹
        </button>
      </div>
    </div>
  </div>
  <div
    class="{addressForm
      ? 'block'
      : 'hidden'} mx-auto bg-gray-200 rounded-md p-10 absolute top-16 z-50 w-full"
  >
    <div class="formContainer">
      <div class="form">
        <div
          class="head flex items-center justify-between border-b mb-2 border-black"
        >
          <h1>Add Your Address</h1>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <svg
            on:click={() => (addressForm = !addressForm)}
            class="w-6 h-6 cursor-pointer"
            viewBox="-0.5 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g><g id="SVGRepo_iconCarrier">
              <path
                d="M3 21.32L21 3.32001"
                stroke="#000000"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M3 3.32001L21 21.32"
                stroke="#000000"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g></svg
          >
        </div>
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
        <div class="inp mb-5">
          <label for="reciever-type">Address Type</label>
          <br />
          <input
            bind:value={recType}
            name="reciever-type"
            id="reciever-type"
            class="w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
            type="text"
            required
            placeholder="Home, Office, etc."
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
            <label class="ml-2 sm:ml-8 md:ml-8 lg:ml-8" for="reciever-last"
              >Recipient's Last Name</label
            >
            <br />
            <input
              bind:value={recLName}
              name="reciever-last"
              id="reciever-last"
              class="w-11/12 ml-2 sm:ml-8 md:ml-8 lg:ml-8 p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
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
            <label class="ml-2 sm:ml-8 md:ml-8 lg:ml-8" for="city">City</label>
            <br />
            <input
              bind:value={recCity}
              name="city"
              id="city"
              class="w-11/12 ml-2 sm:ml-8 md:ml-8 lg:ml-8 p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
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
            <label class="ml-2 sm:ml-8 md:ml-8 lg:ml-8" for="phone"
              >Phone Number</label
            >
            <br />
            <input
              bind:value={recPhone}
              name="phone"
              id="phone"
              class="w-11/12 ml-2 sm:ml-8 md:ml-8 lg:ml-8 p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              type="tel"
              minlength="6"
              required
            />
          </div>
        </div>
      </div>

      <button
        on:click={addAddressData}
        class="w-full button flex items-center justify-center rounded-md border border-transparent bg-gray-600 px-3 py-2 mt-3 cursor-pointer text-base font-medium text-white shadow-sm hover:bg-gray-700"
      >
        <div class={addRessLoad ? "block" : "hidden"}>
          <div role="status">
            <svg
              aria-hidden="true"
              class="w-auto h-6 mr-2 text-gray-200 animate-spin dark:text-gray-700 fill-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        {addRessLoad ? "Adding Address" : "Add Address"}
      </button>
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
