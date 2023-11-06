<script>
  import "../../lib/global.css";
  import supabase from "../../lib";
  import { fade, fly } from "svelte/transition";
  import { onMount } from "svelte";

  let productName, selected, files, productDesc, productPrice, fileName, file;

  async function uploadProduct() {
    let imageArray = [];

    try {
      for (let i = 0; i < files.length; i++) {
        fileName = files[i].name;
        file = files[i];

        const { data, error } = await supabase.storage
          .from("product_image")
          .upload(`product_image/${fileName}`, file);

        const { data: dataOne } = await supabase.storage
          .from("product_image")
          .getPublicUrl(`product_image/${fileName}`);

        imageArray.push(dataOne);
      }

      const productDataToInsert = {
        product_category: selected,
        product_name: productName,
        product_description: productDesc,
        product_image: imageArray,
        product_price: productPrice,
      };

      const { data, error } = await supabase
        .from("ProductData")
        .insert(productDataToInsert)
        .then(() => {});

      imageArray = [];

      console.log(data);
    } catch {}
  }
</script>

<main>
  <div
    transition:fly={{ y: 200 }}
    class="flex min-h-full flex-col justify-center px-6 py-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-10 w-auto"
        src="https://raw.githubusercontent.com/panchalbhavya2210/e-commerce-try/main/src/lib/Screenshot_2023-10-15_162702-transformed-removebg-preview.png"
        alt="Your Company"
      />
      <h2
        class="mt-2 text-center text-2xl font-medium leading-9 tracking-tight text-gray-900"
      >
        List your product
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
            >Select product category</label
          >
          <select
            required
            bind:value={selected}
            id="countries"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing & Fashion</option>
            <option value="Home">Home & Furniture</option>
            <option value="Books">Books & Media</option>
            <option value="Groceries">Groceries & Food</option>
            <option value="Health">Health & Wellness</option>
            <option value="Toys">Toys & Games</option>
            <option value="Sports">Sports & Outdoors</option>
            <option value="Pet">Pet Supplies</option>
            <option value="Gifts">Gifts</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label
              for=""
              class="block text-sm font-medium leading-6 text-gray-900"
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
            <label
              for=""
              class="block text-sm font-medium leading-6 text-gray-900"
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
          <label
            class="mt-3 block text-sm font-medium text-gray-800"
            for="file_input">Upload file</label
          >
          <input
            multiple
            bind:files
            accept="image/jpeg, image/jpg, image/svg, image/png, image/webp"
            class="mt-1 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
          />
        </div>

        <div>
          <button
            type="submit"
            on:click={uploadProduct}
            class="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black hover:transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >
            <div role="status" class=" {'' ? 'block' : 'hidden'}">
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
            {"" ? "Signing Up" : "Sign Up"}</button
          >
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Already a ShopAholic?
        <a
          href="/Login"
          class="font-semibold leading-6 text-gray-700 hover:text-black underline"
          >Login</a
        >
      </p>

      <div
        class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md w-96 max-w-sm fixed bottom-5 transition-all duration-300 {''
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
            <p class="text-sm break-all">Signed Up successfully.</p>
          </div>
        </div>
      </div>
      <div
        class="bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md max-w-sm w-96 fixed bottom-5 transition-all duration-300 {''
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
            <p class="font-bold">{"h"}</p>
            <p class="text-sm break-all">{"h"}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
