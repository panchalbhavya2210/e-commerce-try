<script>
  // Importing the `onMount` function from the Svelte framework to perform actions when the component is mounted.
  import { onMount } from "svelte";

  // Importing the Supabase client and global styles.
  import supabase from "../../lib/index";
  import "../../lib/global.css";

  // Declaring variables to store user ID and an array for rendering user orders.
  let user_id;
  let renderUserArr = [];
  let renderSellerArr = [];
  let type;

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

  // Asynchronous function to load user orders.
  async function LoadUserOrder() {
    // A map to store the count of each product ID.
    const countMap = {};

    // Fetching user information using Supabase authentication.
    const response = await supabase.auth.getUser();
    user_id = response.data.user.id;
    console.log(response);

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
    console.log(renderUserArr);
  }

  async function LoadSellerOrder() {
    const countMap = {};

    // Fetching user information using Supabase authentication.
    const response = await supabase.auth.getUser();
    user_id = response.data.user.id;
    console.log(user_id);

    const { data, error } = await supabase
      .from("order_table")
      .select("*")
      .eq("seller_id", user_id);

    renderSellerArr = data;
    console.log(renderSellerArr);

    // Storing order data in the render array and logging it.
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
  // Using the `onMount` function to call the `LoadUserOrder` function when the component is mounted.
  onMount(() => {
    DataType();

    setTimeout(() => {
      if (type == "User") {
        LoadUserOrder();
      } else if (type == "Seller") {
        LoadSellerOrder();
      } else {
        null;
      }
    }, 1000);
  });
</script>

<!--  -->
<main>
  {#if type == "User"}
    <div class="itemOne">
      {#each renderUserArr as userRender}
        <div class="orderDetailss mt-10">
          <div class="orderDetails ml-10">
            <div>
              <h2 class="font-semibold text-gray-700">
                #Order {userRender.order_id}
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
                    <p class="truncate sm:whitespace-normal sm:w-56">
                      {userRender.product_desc}
                    </p>
                  </div>

                  <div
                    class="lin w-full h-0.5 my-2 bg-gray-400 sm:hidden md:hidden lg:hidden"
                  />

                  <div class="sm:flex mt-2 justify-between mx-1">
                    <div class="sm:mx-5 my-2">
                      <p class="font-medium">Delivery Address</p>
                      <p class="text-gray-800 truncate w-full lg:w-52 sm:w-24">
                        {userRender.customer_name}
                      </p>
                      <p class="text-gray-800 truncate w-full lg:w-52 sm:w-24">
                        {userRender.customer_address}
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
                {#if userRender.order_status == "Received"}
                  <div
                    class="progressbar hidden sm:block lg:block bg-blue-600
                 lg:w-20 rounded-full h-2"
                  />
                {:else}
                  <div
                    class="progressbar hidden sm:block bg-blue-600 lg:hidden rounded-full h-2"
                  />
                {/if}
                {#if userRender.order_status == "Processed"}
                  <div
                    class="progressbar hidden sm:block lg:block bg-blue-600
                 lg:w-96 rounded-full h-2"
                  />
                {:else}
                  <div
                    class="progressbar hidden sm:block bg-blue-600 lg:hidden rounded-full h-2"
                  />
                {/if}
                {#if userRender.order_status == "Shipped"}
                  <div
                    class="progressbar hidden sm:block lg:block bg-blue-600
                 lg:w-11/12 rounded-full h-2"
                  />
                {:else}
                  <div
                    class="progressbar hidden sm:block bg-blue-600 lg:hidden rounded-full h-2"
                  />
                {/if}
                {#if userRender.order_status == "Pending"}
                  <div
                    class="progressbar hidden sm:block lg:block bg-blue-600
                 lg:w-4 rounded-full h-2"
                  />
                {:else}
                  <div
                    class="progressbar hidden sm:block bg-blue-600 lg:hidden rounded-full h-2"
                  />
                {/if}
                <div
                  class="vbar sm:hidden md:hover: lg:hidden block w-2 h-44 absolute bg-blue-600 rounded-full"
                />
                <div
                  class="xname lg:flex lg:justify-between sm:flex sm:justify-between md:flex md:justify-between font-medium"
                >
                  {#if userRender.order_status == "Received"}
                    <p>Order Received</p>
                  {:else if userRender.order_status == "Processed" || userRender.order_status == "Shipped"}
                    <p>Order Received</p>
                  {:else}
                    <p>Null</p>
                  {/if}
                  {#if userRender.order_status == "Processed"}
                    <p>Order Processed</p>
                  {:else}
                    <p>Processing Order</p>
                  {/if}
                  {#if userRender.order_status == "Shipped"}
                    <p>Order Shipped</p>
                  {:else}
                    <p>Shipping Order</p>
                  {/if}
                  {#if userRender.order_status == "Delivered"}
                    <p>Order Delivered</p>
                  {:else}
                    <p>Order In Delivery</p>
                  {/if}
                  <!-- <p class="my-5 mx-5">Processed</p>
                  <p class="my-5 mx-5">Shipped</p>
                  <p class="my-5 mx-5">Delivered</p> -->
                </div>
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
                <!-- <div
                  class="progressbar hidden sm:block lg:block lg:w-full bg-blue-600 rounded-full h-2"
                />
                <div
                  class="vbar sm:hidden md:hover: lg:hidden block w-2 h-44 absolute bg-blue-600 rounded-full"
                /> -->
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
                      ? "Order Shipped"
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
</main>
