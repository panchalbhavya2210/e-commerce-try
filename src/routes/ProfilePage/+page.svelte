<script>
  import { onMount } from "svelte";
  import "../../lib/global.css";
  import edit from "../../lib/assets/edit-3-svgrepo-com.svg";
  import delet from "../../lib/assets/delete-2-svgrepo-com.svg";
  import supabase from "../../lib/index";
  let img,
    username,
    userid,
    email,
    productName,
    productDesc,
    productPrice,
    loaderState,
    errorState,
    successState,
    errBody,
    errName,
    productQty,
    hiddenState;
  let userType,
    rowDataif = 1,
    loadData = true,
    loadProduct = true,
    productArr = [];
  async function getUidData() {
    let supabaseAuthId = await supabase.auth.getUser().then((response) => {
      let authId = response.data.user.id;
      userid = authId;
      console.log(authId);
      async function getData() {
        const { data, error } = await supabase
          .from("user_auth_data")
          .select("*")
          .eq("auth_uid", authId);
        const { data: seller, error: serror } = await supabase
          .from("seller_auth_data")
          .select("*")
          .eq("auth_uid", authId);

        if (data && data.length > 0) {
          loadData = false;
          const rowData = data[0];
          img = rowData.user_profile;
          userType = rowData.user_type;
          username = rowData.user_name;
          email = rowData.user_email;
        } else if (seller && seller.length > 0) {
          loadData = false;
          const rowData = seller[0];
          img = rowData.seller_image;
          email = rowData.seller_email;
          userType = rowData.user_type;
          username = rowData.seller_name;

          const { data, error } = await supabase
            .from("ProductData")
            .select("*")
            .eq("seller_id", authId);
          console.log(data);
          productArr = data;
        } else {
          rowDataif = 0;
        }
      }
      getData();
    });
  }
  onMount(() => {
    setTimeout(() => {
      getUidData();
    }, 1500);
  });

  let prdId;

  function updateProduct(productRender) {
    prdId = productRender.id;
    hiddenState = !hiddenState;
    console.log(productRender);

    productName = productRender.product_name;
    productDesc = productRender.product_description;
    productPrice = productRender.product_price;
    productQty = productRender.product_qty;
  }
  async function uploadProduct(productRender) {
    const { data, error } = await supabase
      .from("ProductData")
      .update({
        product_name: productName,
        product_description: productDesc,
        product_price: productPrice,
        product_qty: productQty,
      })
      .eq("id", prdId);

    console.log(data);
  }
</script>

<main>
  {#if loadData == true}
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
          class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"
        />
        <div
          class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"
        />
        <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
        <div
          class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"
        />
        <div
          class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"
        />
        <div
          class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"
        />
      </div>
      <span class="sr-only">Loading...</span>
    </div>
  {:else}
    <div class="profileCard">
      <div
        class="profileImg sm:flex sm:items-center sm:justify-start md:flex md:items-center md:justify-start lg:flex lg:items-center lg:justify-start w-full h-40"
      >
        <img src={img} alt="" class=" mx-10 w-auto h-44 rounded-full p-2" />
        <div class="detailGiver">
          <p class="ml-10 font-semibold">{username}</p>
          <p class="ml-10 font-medium">{email}</p>
          <p class="ml-10 font-normal">{userid}</p>
        </div>
      </div>
    </div>
  {/if}

  {#if productArr.length == 0}
    <div
      role="status"
      class="w-full space-y-4 p-10 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 dark:border-gray-700"
    >
      <div class="flex items-center justify-between">
        <div>
          <div
            class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"
          />
          <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
        </div>
        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
      </div>
      <div class="flex items-center justify-between pt-4">
        <div>
          <div
            class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"
          />
          <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
        </div>
        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
      </div>
      <div class="flex items-center justify-between pt-4">
        <div>
          <div
            class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"
          />
          <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
        </div>
        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
      </div>
      <div class="flex items-center justify-between pt-4">
        <div>
          <div
            class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"
          />
          <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
        </div>
        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
      </div>
      <div class="flex items-center justify-between pt-4">
        <div>
          <div
            class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"
          />
          <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
        </div>
        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
      </div>
      <span class="sr-only">Loading...</span>
    </div>
  {:else}
    <div class="mt-32 sm:m-0 md:m-0 lg:m-0">
      <div class="line w-full h-0.5 bg-gray-400 rounded-full" />

      {#each productArr as productRender (productRender.id)}
        <div class="productRender p-5">
          <div class="w-full p-3 shadow-lg my-2 relative">
            <div
              class="imgHolder w-full sm:w-40 md:w-40 lg:w-40 sm:my-5 md:my-5 lg:my-5 h-full sm:flex sm:items-center sm:justify-start md:flex md:items-center md:justify-start lg:flex lg:items-center lg:justify-start sm:mx-5 md:mx-5 lg:mx-5"
            >
              <img
                src={productRender.product_image_d}
                class="w-auto h-full sm:h-20 md:w-20 lg:w-20"
                alt=""
              />

              <div class="itemDetails">
                <p
                  class=" bg-gray-300 min-w-0 text-center sm:mx-5 md:mx-5 lg:mx-5 mx-3 my-1 rounded-full p-1 font-medium text-sm"
                >
                  {productRender.product_category}
                </p>
                <p class="sm:mx-5 md:mx-5 lg:mx-5 mx-3 my-1 font-medium">
                  {productRender.product_name}
                </p>
                <p
                  class="sm:mx-5 md:mx-5 lg:mx-5 mx-3 my-1 font-normal truncate w-20"
                >
                  {productRender.product_description}
                </p>
                <p class="sm:mx-5 md:mx-5 lg:mx-5 mx-3 my-1 font-semibold w-20">
                  {productRender.product_price}₹
                </p>
              </div>

              <div class="buttonContainer">
                <div class="flex">
                  <button
                    on:click={() => updateProduct(productRender)}
                    class="w-full p-3 bg-gray-300 m-1 rounded-md flex justify-center items-center lg:absolute lg:right-10 lg:w-20 lg:top-5 sm:absolute sm:right-10 sm:w-20 sm:top-5 md:absolute md:right-10 md:w-20 md:top-5"
                  >
                    <img src={edit} class="w-auto h-6" alt="" /></button
                  >
                  <button
                    class="w-full p-3 bg-gray-300 m-1 rounded-md flex justify-center items-center lg:absolute lg:right-10 lg:w-20 sm:absolute sm:right-10 sm:w-20 md:absolute md:right-10 md:w-20"
                  >
                    <img src={delet} class="w-auto h-6" alt="" /></button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</main>

<div
  class="mt-0 fixed {hiddenState
    ? 'flex'
    : 'hidden'} justify-center items-center bg-white w-full top-0 sm:mx-auto sm:w-full sm:max-w-sm"
>
  <form class="space-y-6">
    <div>
      <label
        for="fname"
        class="block text-sm font-medium leading-6 text-gray-900"
        >Product Name</label
      >
      <div class="mt-1">
        <input
          id="fname"
          name="fname"
          type="text"
          bind:value={productName}
          required
          class="font-medium p-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>

    <div>
      <label
        for="countries"
        class="block mb-2 text-sm font-medium text-gray-900"
        >Adjust Product Quantity</label
      >
      <div class="mt-1">
        <input
          type="number"
          bind:value={productQty}
          required
          class="font-medium p-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between">
        <label for="" class="block text-sm font-medium leading-6 text-gray-900"
          >Product Description</label
        >
      </div>
      <div class="mt-1">
        <textarea
          required
          bind:value={productDesc}
          class="font-medium p-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
        />
      </div>
      <div class="flex items-center justify-between mt-4">
        <label for="" class="block text-sm font-medium leading-6 text-gray-900"
          >Product Price</label
        >
      </div>
      <div class="mt-1">
        <input
          type="number"
          bind:value={productPrice}
          required
          class="font-medium p-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>

    <div>
      <button
        id="btn"
        type="submit"
        on:click={uploadProduct}
        class="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black hover:transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
      >
        <div role="status" class=" {loaderState ? 'block' : 'hidden'}">
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
        {loaderState ? "Updating Product" : "Update Product"}</button
      >
    </div>
  </form>

  <div
    class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md w-96 max-w-sm fixed bottom-5 transition-all duration-300 {successState
      ? 'translate-y-0 opacity-100'
      : 'translate-y-24 opacity-0'}"
    role="alert"
  >
    <div class="flex">
      <div class="py-1">
        <svg
          class="fill-current h-6 w-6 text-teal-500 mr-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          ><path
            d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"
          /></svg
        >
      </div>
      <div>
        <p class="font-bold">Success.</p>
        <p class="text-sm break-all">Product updated.</p>
      </div>
    </div>
  </div>
  <div
    class="bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md max-w-sm w-96 fixed bottom-5 transition-all duration-300 {errorState
      ? 'translate-y-0 opacity-100'
      : 'translate-y-24 opacity-0'}"
    role="alert"
  >
    <div class="flex">
      <div class="py-1">
        <svg
          class="fill-current h-6 w-6 text-red-500 mr-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          ><path
            d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"
          /></svg
        >
      </div>
      <div>
        <p class="font-bold">{errName}</p>
        <p class="text-sm break-all">{errBody}</p>
      </div>
    </div>
  </div>
</div>
