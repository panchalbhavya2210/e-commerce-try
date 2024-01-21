<script>
  // Importing the `onMount` function from the Svelte framework to perform actions when the component is mounted.
  import { onMount } from "svelte";
  import done from "../../lib/assets/done-round-svgrepo-com.svg";

  // Importing the Supabase client and global styles.
  import supabase from "../../lib/index";
  import "../../lib/global.css";

  // Declaring variables to store user ID and an array for rendering user orders.
  let user_id, orderConfirmation, newData;
  let renderUserArr = [];
  let renderSellerArr = [];
  let type = "User";

  async function DataType() {
    const response = await supabase.auth.getUser();
    user_id = response.data.user.id;

    const { data: sellerData, error: SellerErit } = await supabase
      .from("seller_auth_data")
      .select("*")
      .eq("auth_uid", user_id);

    const { data: userData, error: erit } = await supabase
      .from("user_auth_data")
      .select("*")
      .eq("auth_uid", user_id);

    if (sellerData.length != 0) {
      type = "Seller";
    } else if (userData != 0) {
      type = "User";
    } else {
      type = null;
    }
  }
  let address_id,
    data_of_addr = [],
    mappedData = [];

  // Asynchronous function to load user orders.
  async function LoadUserOrder() {
    // A map to store the count of each product ID.
    data_of_addr;

    // Fetching user information using Supabase authentication.
    const response = await supabase.auth.getUser();
    user_id = response.data.user.id;

    const { data: sellerData, error: SellerErit } = await supabase
      .from("seller_auth_data")
      .select("*")
      .eq("auth_uid", user_id);

    const { data: userData, error: erit } = await supabase
      .from("user_auth_data")
      .select("*")
      .eq("auth_uid", user_id);

    if (sellerData.length != 0) {
      type = "Seller";
    } else if (userData != 0) {
      type = "User";
    } else {
      type = null;
    }

    // Fetching orders from the 'order_table' where the user ID matches.
    const { data, error } = await supabase
      .from("order_table")
      .select("*")
      .eq("user_id", user_id);

    // Storing order data in the render array and logging it.
    renderUserArr = data;

    const fetchAdd = data.map((item) => item.address_id);

    const { data: address, error: addrError } = await supabase
      .from("address_data")
      .select("*")
      .in("id", fetchAdd);

    data_of_addr = address;
    console.log(data_of_addr);

    data_of_addr.forEach((item) => {
      mappedData[item.id] = item;
    });
    data_of_addr = mappedData;
    console.log(mappedData);
    // Now, mappedData will have elements at the specified address_id

    // Example usage:
    // const addressIdToAccess = 2;
    // if (mappedData[addressIdToAccess]) {
    //   console.log(mappedData[addressIdToAccess].reciever_name);
    // } else {
    //   console.log("Data not found for the given address_id");
    // }
  }
  async function LoadSellerOrder() {
    // Fetching user information using Supabase authentication.
    const response = await supabase.auth.getUser();
    user_id = response.data.user.id;
    console.log(user_id);

    const { data, error } = await supabase
      .from("order_table")
      .select("*")
      .eq("seller_id", user_id);

    renderSellerArr = data;
  }

  async function markProc(sellerRender) {
    const { data, error } = await supabase
      .from("order_table")
      .update({
        order_status: "Processed",
      })
      .eq("id", sellerRender.id)
      .select();
  }
  async function markShip(sellerRender) {
    const { data, error } = await supabase
      .from("order_table")
      .update({
        order_status: "Shipped",
      })
      .eq("id", sellerRender.id);
  }
  async function markOrder(sellerRender) {
    const { data, error } = await supabase
      .from("order_table")
      .update({
        order_status: "Received",
      })
      .eq("id", sellerRender.id);
  }

  async function runCancel(s) {
    console.log(s.order_status);
    let isDelivered = s.order_status;
    console.log(s.product_ids);

    if (isDelivered == "Delivered") {
      console.log("Can't Cancel the delivered order");
    } else {
      const { data, error } = await supabase
        .from("order_table")
        .delete()
        .eq("product_ids", s.product_ids);
    }
  }

  const channels = supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "order_table" },
      (payload) => {
        console.log("Change received!", payload);
      }
    )
    .subscribe();

  console.log(channels);
  // Using the `onMount` function to call the `LoadUserOrder` function when the component is mounted.
  onMount(() => {
    DataType();

    setTimeout(() => {
      console.log(type);
      if (type == "User") {
        LoadUserOrder();
      } else if (type == "Seller") {
        LoadSellerOrder();
      } else {
        console.log("notype");
        null;
      }
    }, 1000);
  });
</script>

<main>
  {#if type == "User"}
    <div class="itemOne">
      {#each renderUserArr as userRender}
        <div class="orderDetailss mt-10">
          <div class="orderDetails ml-10">
            <div>
              <h2 class="font-semibold text-gray-700">
                #Order {userRender.order_id}
                {#if userRender.order_status == "Shipped"}
                  | #OTP {userRender.customer_otp}
                {/if}
              </h2>
            </div>
          </div>
          <div class="bg w-full flex items-center justify-center">
            <div class="w-11/12 rounded-md p-5 shadow-md bg-gray-100">
              <div class="w-full imageDetail sm:flex sm:justify-start block">
                <div
                  class="w-full img flex justify-start sm:flex md:w-32 sm:min-w-min"
                >
                  <img
                    src={userRender.product_image}
                    class="h-11/12 w-auto md:h-32 md:w-auto sm:h-32 sm:w-full rounded-sm"
                    alt=""
                  />
                </div>
                <div class="block sm:flex sm:mx-5 md:mx-5">
                  <div class="hello mt-2 mx-1">
                    <p class="font-medium my-1">{userRender.product_name}</p>
                    <p class="font-medium my-1 text-gray-700">
                      {userRender.product_price}₹
                    </p>
                    <p
                      class="truncate sm:whitespace-normal sm:w-56 lg:truncate md:truncate sm:truncate"
                    >
                      {userRender.product_desc}
                    </p>
                  </div>

                  <div
                    class="lin w-full h-0.5 my-2 bg-gray-400 sm:hidden md:hidden lg:hidden"
                  />

                  <div class="sm:flex mt-2 justify-between mx-1">
                    <div class="sm:mx-5 my-2">
                      <p class="font-medium">Delivery Address</p>
                      <p class="text-gray-800 w-full lg:w-52 sm:w-24">
                        {data_of_addr[userRender.address_id]?.address_title}
                      </p>
                      <p class="text-gray-800 w-full lg:w-52 sm:w-24">
                        {data_of_addr[userRender.address_id]?.reciever_name}
                      </p>
                      <p class="text-gray-800 w-full lg:w-52 sm:w-24">
                        {data_of_addr[userRender.address_id]?.user_phone}
                      </p>
                      <p class="text-gray-800 w-full lg:w-52 sm:w-24">
                        {data_of_addr[userRender.address_id]?.address_details}
                      </p>
                      <p class="text-gray-800 w-full lg:w-52 sm:w-24">
                        {data_of_addr[userRender.address_id]?.rec_city}
                      </p>
                      <p class="text-gray-800 w-full lg:w-52 sm:w-24">
                        {data_of_addr[userRender.address_id]?.pin_code}
                      </p>
                      <!-- {userRender.address_id}

                      <p>{data_of_addr[userRender.address_id]?.pin_code}</p> -->
                    </div>
                    <!-- <div class="sm:mx-5 my-2">
                      <p class="font-medium">Seller Info</p>
                      <p class="text-gray-800 truncate w-full lg:w-52 sm:w-24">
                        seller name
                      </p>
                      <p class="text-gray-800 truncate w-full lg:w-52 sm:w-24">
                        seller details
                      </p>
                      <p class="text-gray-800 truncate w-full lg:w-52 sm:w-24">
                        seller email
                      </p>
                    </div> -->
                  </div>
                  <div
                    class="lin w-full h-0.5 my-2 bg-gray-400 sm:hidden md:hidden lg:hidden"
                  />
                </div>
              </div>

              <div class="progress mt-10">
                {#if userRender.order_status == "Received"}
                  <div
                    class="progressbar hidden sm:block lg:block bg-blue-600 sm:w-20 md:w-20 lg:w-20 rounded-full h-2 transition-width duration-1000"
                  >
                    <!-- Your content goes here -->
                  </div>
                {:else}
                  <!-- Your content goes here -->
                {/if}
                {#if userRender.order_status == "Processed"}
                  <div
                    class="progressbar hidden sm:block lg:block bg-blue-600 sm:w-96 md:w-96 lg:w-96 rounded-full h-2 transition-width duration-1000"
                  >
                    <!-- Your content goes here -->
                  </div>
                {/if}
                {#if userRender.order_status == "Shipped"}
                  <div
                    class="progressbar hidden sm:block lg:block bg-blue-600 sm:w-4/5 md:w-4/5 lg:w-4/5 rounded-full h-2 transition-all duration-1000"
                  >
                    <!-- Your content goes here -->
                  </div>
                {/if}
                {#if userRender.order_status == "Delivered"}
                  <div
                    class="progressbar hidden sm:block lg:block bg-blue-600 sm:w-full md:w-full lg:w-full rounded-full h-2 transition-width duration-1000"
                  >
                    <!-- Your content goes here -->
                  </div>
                {/if}
                {#if userRender.order_status == "Pending"}
                  <div
                    class="progressbar hidden sm:block lg:block bg-blue-600 sm:w-5 md:w-5 lg:w-5 rounded-full h-2 transition-width duration-1000"
                  >
                    <!-- Your content goes here -->
                  </div>
                {:else}
                  <!--  -->
                {/if}

                <!-- 44 full -->

                {#if userRender.order_status == "Received"}
                  <div
                    class="vbar sm:hidden md:hover: lg:hidden block w-2 h-5 absolute bg-blue-600 rounded-full"
                  />
                {:else}
                  <div
                    class="vbar sm:hidden md:hover: lg:hidden block w-2 h-0 absolute bg-blue-600 rounded-full"
                  />
                {/if}
                {#if userRender.order_status == "Processed"}
                  <div
                    class="vbar sm:hidden md:hover: lg:hidden block w-2 h-16 absolute bg-blue-600 rounded-full"
                  />
                {:else}
                  <div
                    class="vbar sm:hidden md:hover: lg:hidden block w-2 h-0 absolute bg-blue-600 rounded-full"
                  />
                {/if}
                {#if userRender.order_status == "Shipped"}
                  <div
                    class="vbar sm:hidden md:hover: lg:hidden block w-2 h-32 absolute bg-blue-600 rounded-full"
                  />
                {:else}
                  <div
                    class="vbar sm:hidden md:hover: lg:hidden block w-2 h-0 absolute bg-blue-600 rounded-full"
                  />
                {/if}
                {#if userRender.order_status == "Delivered"}
                  <div
                    class="vbar sm:hidden md:hover: lg:hidden block w-2 h-44 absolute bg-blue-600 rounded-full"
                  />
                {:else}
                  <div
                    class="vbar sm:hidden md:hover: lg:hidden block w-2 h-0 absolute bg-blue-600 rounded-full"
                  />
                {/if}
                <!-- <div
                  class="vbar sm:hidden md:hover: lg:hidden block w-2 h-44 absolute bg-blue-600 rounded-full"
                /> -->
                <div
                  class="xname lg:flex lg:justify-between sm:flex sm:justify-between md:flex md:justify-between font-medium"
                >
                  {#if userRender.order_status == "Received"}
                    <p class="mt-7 ml-5">Order Received</p>
                  {:else if userRender.order_status == "Processed" || userRender.order_status == "Shipped" || userRender.order_status == "Delivered"}
                    <p class="mt-7 ml-5">Order Received</p>
                  {:else if userRender.order_status == "Pending"}
                    <p class="mt-7 ml-5">Order Pending</p>
                  {:else}
                    <p class="mt-7 ml-5">Unconfirmed Order</p>
                  {/if}
                  {#if userRender.order_status == "Processed"}
                    <p class="mt-7 ml-5">Order Processed</p>
                  {:else if userRender.order_status == "Processed" || userRender.order_status == "Shipped" || userRender.order_status == "Delivered"}
                    <p class="mt-7 ml-5">Order Processed</p>
                  {:else if userRender.order_status == "Received"}
                    <p class="mt-7 ml-5">Order Processing</p>
                  {:else}
                    <p class="mt-7 ml-5">Unprocessed Order</p>
                  {/if}
                  {#if userRender.order_status == "Shipped"}
                    <p class="mt-7 ml-5">Order Shipped</p>
                  {:else if userRender.order_status == "Processed"}
                    <p class="mt-7 ml-5">Shiping Order</p>
                  {:else if userRender.order_status == "Delivered"}
                    <p class="mt-7 ml-5">Order Shipped</p>
                  {:else}
                    <p class="mt-7 ml-5">Unshipped Order</p>
                  {/if}
                  {#if userRender.order_status == "Delivered"}
                    <p class="mt-7 ml-5">Order Delivered</p>
                  {:else if userRender.order_status == "Shipped"}
                    <p class="mt-7 ml-5">Delivering Order</p>
                  {:else}
                    <p class="mt-7 ml-5">Undelivered Order</p>
                  {/if}
                </div>
              </div>

              <div class="cancelbtn">
                <button
                  on:click={runCancel(userRender)}
                  class="w-full p-2 mt-2 rounded-md border-red-400 border-2"
                  >CANCEL THIS ORDER</button
                >
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="itemOne">
      {#each renderSellerArr as sellerRender}
        <div class="orderDetailss mt-10">
          <div class="orderDetails ml-10">
            <div>
              <h2 class="font-semibold text-gray-700">
                #Order {sellerRender.order_id}
              </h2>
            </div>
          </div>
          <div class="bg w-full flex items-center justify-center">
            <div class="w-11/12 rounded-md p-5 shadow-md sm:h-80 bg-gray-100">
              <div class="w-full imageDetail sm:flex sm:justify-start block">
                <div
                  class="w-full img flex justify-start sm:flex md:w-32 sm:min-w-min"
                >
                  <img
                    src={sellerRender.product_image}
                    class="h-11/12 w-auto md:h-32 md:w-auto sm:h-32 sm:w-full rounded-sm"
                    alt=""
                  />
                </div>
                <div class="block sm:flex sm:mx-5 md:mx-5">
                  <div class="hello mt-2 mx-1">
                    <p class="font-medium my-1">{sellerRender.product_name}</p>
                    <p class="font-medium my-1 text-gray-700">
                      {sellerRender.product_price}₹
                    </p>
                    <p class="truncate sm:whitespace-normal sm:w-56">
                      {sellerRender.product_desc}
                    </p>
                  </div>

                  <div
                    class="lin w-full h-0.5 my-2 bg-gray-400 sm:hidden md:hidden lg:hidden"
                  />

                  <div class="sm:flex mt-2 justify-between mx-1">
                    <div class="sm:mx-5 my-2">
                      <p class="font-medium">Delivery Address</p>
                      <p class="text-gray-800 truncate w-full lg:w-52 sm:w-24">
                        {sellerRender.customer_name}
                      </p>
                      <p class="text-gray-800 truncate w-full lg:w-52 sm:w-24">
                        {sellerRender.customer_address}
                      </p>
                      <p class="text-gray-800 truncate w-full lg:w-52 sm:w-24">
                        Digvijaynagar
                      </p>
                      <p class="text-gray-800 truncate w-full lg:w-52 sm:w-24">
                        Hello
                      </p>
                      <p class="text-gray-800 truncate w-full lg:w-52 sm:w-24">
                        382345
                      </p>
                    </div>
                    <div class="sm:mx-5 my-2">
                      <p class="font-medium">Seller Info</p>
                      <p class="text-gray-800 truncate w-full lg:w-52 sm:w-24">
                        seller name
                      </p>
                      <p class="text-gray-800 truncate w-full lg:w-52 sm:w-24">
                        seller details
                      </p>
                      <p class="text-gray-800 truncate w-full lg:w-52 sm:w-24">
                        seller email
                      </p>
                    </div>
                  </div>
                  <div
                    class="lin w-full h-0.5 my-2 bg-gray-400 sm:hidden md:hidden lg:hidden"
                  />
                </div>
              </div>

              <div class="progress mt-10">
                <div
                  class="xname lg:flex lg:justify-between lg:items-center sm:flex sm:justify-between md:flex md:justify-between font-medium"
                >
                  <button
                    on:click={() => markOrder(sellerRender)}
                    disabled={sellerRender.order_status == "Received" ||
                      sellerRender.order_status == "Processed" ||
                      sellerRender.order_status == "Shipped"}
                    class=" rounded-lg mt-10 h-10 px-2 {sellerRender.order_status ==
                      'Received' ||
                    sellerRender.order_status == 'Processed' ||
                    sellerRender.order_status == 'Shipped'
                      ? 'bg-green-300 text-green-700'
                      : 'bg-gray-300 text-gray-700'}"
                  >
                    {sellerRender.order_status == "Received" ||
                    sellerRender.order_status == "Processed" ||
                    sellerRender.order_status == "Shipped"
                      ? "Order Accepted"
                      : "Accept Order"}
                  </button>

                  <button
                    on:click={() => markProc(sellerRender)}
                    disabled={sellerRender.order_status == "Processed" ||
                      sellerRender.order_status == "Received" ||
                      sellerRender.order_status == "Shipped"}
                    class="bg-gray-300 rounded-lg mt-10 h-10 px-2 text-gray-800 {sellerRender.order_status ==
                      'Processed' ||
                    sellerRender.order_status == 'Received' ||
                    sellerRender.order_status == 'Shipped'
                      ? 'bg-green-300 text-green-700'
                      : 'bg-gray-300 text-gray-700'}"
                  >
                    {sellerRender.order_status == "Processed" ||
                    sellerRender.order_status == "Shipped" ||
                    sellerRender.order_status == "Received"
                      ? "Order Processed"
                      : "Process Order"}
                  </button>

                  <button
                    on:click={() => markShip(sellerRender)}
                    disabled={sellerRender.order_status == "Shipped"}
                    class="bg-gray-300 rounded-lg mt-10 h-10 px-2 text-gray-800 {sellerRender.order_status ==
                    'Shipped'
                      ? 'bg-green-300 text-green-700'
                      : 'bg-gray-300 text-gray-700'}"
                  >
                    {sellerRender.order_status == "Shipped"
                      ? "Order Shipped (In Delivery)"
                      : "Ship Order"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}

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
</main>

<style>
  .progressbar {
    transition: all;
    transition-duration: 1s;
  }
</style>
