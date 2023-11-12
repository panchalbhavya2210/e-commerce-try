<script>
  // Importing the `onMount` function from the Svelte framework to perform actions when the component is mounted.
  import { onMount } from "svelte";

  // Importing the Supabase client and global styles.
  import supabase from "../../lib/index";
  import "../../lib/global.css";

  // Declaring variables to store user ID and an array for rendering user orders.
  let user_id;
  let renderUserArr = [];
  let productUserArr = [];
  let productUserArr2 = [];
  let order;

  // Asynchronous function to load user orders.
  async function LoadUserOrder() {
    // A map to store the count of each product ID.
    const countMap = {};

    // Fetching user information using Supabase authentication.
    const response = await supabase.auth.getUser();
    user_id = response.data.user.id;
    console.log(user_id);

    // Fetching orders from the 'order_table' where the user ID matches.
    const { data, error } = await supabase
      .from("order_table")
      .select("*")
      .eq("user_id", user_id);

    // Storing order data in the render array and logging it.
    renderUserArr = data;
    console.log(renderUserArr);

    // Creating an array of product IDs from the fetched order data.
    const fetchArr = data.map((item) => item.product_ids);
    console.log(fetchArr);

    /**
     * TODO: This is the quantity calculation formula
     * Uncomment the following lines if you want to calculate the quantity of each product.
     */
    /*
  fetchArr.forEach((element) => {
    if (countMap[element]) {
      countMap[element]++;
    } else {
      countMap[element] = 1;
    }
  });

  for (const key in countMap) {
    if (countMap[key] > 1) {
      // Do something with products that have a quantity greater than 1.
    }
  }
  */

    // Fetching product data from the 'ProductData' table where the IDs match the order.
    const { data: prdData, error: errData } = await supabase
      .from("ProductData")
      .select("*")
      .in("id", fetchArr);

    productUserArr = prdData;
    console.log(productUserArr);
  }

  // Using the `onMount` function to call the `LoadUserOrder` function when the component is mounted.
  onMount(() => {
    LoadUserOrder();
  });
</script>

<!--  -->
<main>
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
                  src="https://picsum.photos/1000"
                  class="h-11/12 w-auto md:h-32 md:w-auto sm:h-32 sm:w-full rounded-sm"
                  alt=""
                />
              </div>
              <div class="block sm:flex sm:mx-5 md:mx-5">
                <div class="hello mt-2 mx-1">
                  <p class="font-medium my-1">recFName</p>
                  <p class="font-medium my-1 text-gray-700">350₹</p>
                  <p class="truncate sm:whitespace-normal sm:w-56">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    feugiat quam in ligula efficitur, ut ultricies felis
                    bibendum.
                  </p>
                </div>

                <div class="lin w-full h-0.5 my-2 bg-gray-400" />

                <div class="sm:flex mt-2 justify-between mx-1">
                  <div class="sm:mx-5 my-2">
                    <p class="font-medium">Delivery Address</p>
                    <p class="text-gray-800 truncate w-full lg:w-52 sm:w-24">
                      H-110 Sun Real Homes sssssssssss
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
                <div class="lin w-full h-0.5 my-2 bg-gray-400" />
              </div>
            </div>

            <div class="progress mt-10">
              <div
                class="progressbar hidden sm:block lg:block lg:w-full bg-blue-600 rounded-full h-2"
              />
              <div
                class="vbar sm:hidden md:hover: lg:hidden block w-2 h-44 absolute bg-blue-600 rounded-full"
              />
              <div
                class="xname lg:flex lg:justify-between sm:flex sm:justify-between md:flex md:justify-between font-medium"
              >
                <p class="my-7 mx-5">Order Received</p>
                <p class="my-7 mx-5">Processed</p>
                <p class="my-7 mx-5">Shipped</p>
                <p class="my-7 mx-5">Delivered</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</main>
