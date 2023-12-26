<script>
  import supabase from "../../../lib";
  import "../../../lib/global.css";
  import done from "../../../lib/assets/done-round-svgrepo-com.svg";
  import { fade, fly } from "svelte/transition";

  /**
   * * Now how to convert obj to arry
   */

  export let data = [];
  let ratData = [];
  console.log(data);
  let product = data;
  let prd = product.product;

  //obj to array
  let prdCategory, orderConfirmation;

  if (data.product.length != 0) {
    prdCategory = prd[0].product_category;
  } else {
    console.log("it is what it is");
  }
  let ratings = [];

  let array = [];
  let qtyValue;
  let prd_qt = [];
  let imgData = [],
    prdId,
    prdCateg,
    prdDesc,
    prName,
    prPrice,
    prQty,
    sellerInfo,
    prdImages,
    userRating = 1,
    reviewTitle,
    reviewSummary;
  async function showProd(prdDaata) {
    imgData = prdDaata.product_image;
    prdImages = prdDaata.product_image_d;
    prdId = prdDaata.id;
    prdCateg = prdDaata.product_category;
    prdDesc = prdDaata.product_description;
    prName = prdDaata.product_name;
    prPrice = prdDaata.product_price;
    prQty = prdDaata.product_qty;
    sellerInfo = prdDaata.seller_id;

    const { data, error } = await supabase
      .from("review_table")
      .select("*")
      .eq("prd_id", prdId);

    ratData = data;
    for (let i = 0; i < ratData.length; i++) {
      ratings.push(ratData[i].review_stars);
      console.log(ratings);
    }
    setTimeout(() => {
      CalculateRating();
    }, 3000);
  }

  function CalculateRating() {
    const averageRating =
      ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    const roundedRating = Math.min(Math.round(averageRating * 2) / 2, 5);
    const ratingCounts = {
      "1star": 0,
      "2star": 0,
      "3star": 0,
      "4star": 0,
      "5star": 0,
    };
    ratings.forEach((rating) => {
      switch (rating) {
        case 1:
          ratingCounts["1star"] += 1;
          break;
        case 2:
          ratingCounts["2star"] += 1;
          break;
        case 3:
          ratingCounts["3star"] += 1;
          break;
        case 4:
          ratingCounts["4star"] += 1;
          break;
        case 5:
          ratingCounts["5star"] += 1;
          break;
        default:
          break;
      }
    });

    const totalRatings = ratings.length;
    const ratingPercentages = {};

    for (const key in ratingCounts) {
      ratingPercentages[key] = (ratingCounts[key] / totalRatings) * 100;
    }
    console.log(ratingPercentages);
    console.log(roundedRating);
    console.log(ratingCounts);
  }
  async function pushReview() {
    console.log(prdId);
    const reviewToInsert = {
      prd_id: prdId,
      isVerified: "1",
      review_title: reviewTitle,
      review_desc: reviewSummary,
      review_image: "1",
      review_stars: userRating,
      user_name: "1",
      user_image: "1",
    };
    const { data, error } = await supabase
      .from("review_table")
      .insert(reviewToInsert);
    console.log(data, error);
  }
  function getLength(s) {
    console.log(s);
  }

  // async function addCart(prd) {
  //   let supabaseAuthId = await supabase.auth.getUser().then((response) => {
  //     let authId = response.data.user.id;

  //     array.push(prd.id);
  //     prd_qt.push("1");

  //     let cartDataToInsert = {
  //       auth_id: authId,
  //       product_id: prd.id,
  //       product_qty: qtyValue,
  //     };
  //     if (qtyValue <= 0 || qtyValue == undefined || qtyValue == null) {
  //       console.log("add qty first");
  //     } else if (qtyValue > prd.product_qty) {
  //       console.log("ORder Quantity Cannot be greater than stock Quantity");
  //     } else {
  //       async function road() {
  //         const { data, error } = await supabase
  //           .from("CartData")
  //           .insert(cartDataToInsert);

  //         const { data: prod, er } = await supabase
  //           .from("ProductData")
  //           .update({
  //             product_qty: prd.product_qty - qtyValue,
  //           })
  //           .eq("id", prd.id);
  //         console.log(prod, er);

  //         if (error == null) {
  //           orderConfirmation = !orderConfirmation;

  //           setTimeout(() => {
  //             orderConfirmation = !orderConfirmation;
  //           }, 3000);
  //         }
  //       }
  //       for (let index = 0; index < qtyValue; index++) {
  //         road();
  //       }
  //     }
  //   });
  // }
</script>

<main transition:fly={{ y: 200 }}>
  <!-- Breadcrumb -->
  <nav
    class="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 m-3 shadow-md hover:shadow-sm transition-all"
    aria-label="Breadcrumb"
  >
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <a
          href="/"
          class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black"
        >
          <svg
            class="w-3 h-3 mr-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"
            />
          </svg>
          Home
        </a>
      </li>

      <li class="list-none">
        <div class="flex items-center">
          <svg
            class="w-3 h-3 mx-1 text-gray-900"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span class="ml-1 text-sm font-medium text-gray-700 md:ml-2"
            >{prdCategory}</span
          >
        </div>
      </li>
    </ol>
  </nav>

  <div class="categorymenu w-full sm:w-full sm:p-10 md:p-5">
    <div
      class="grid grid-cols-1 gap-5 m-auto sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
    >
      {#each prd as product}
        <div class="rowOne cursor-pointer group transition-all">
          <div class="heightOne h-11/12 shadow-lg p-3">
            <img
              src={product.product_image_d}
              alt=""
              srcset=""
              class="rounded-md transition-all h-full w-full"
            />
            <p class="font-medium text-lg break-words mt-2 m-1">
              {product.product_name}
            </p>
            <p class="break-words m-1">
              {product.product_description}
            </p>
            <p class="break-words m-1">
              Available Qty : {product.product_qty}
            </p>
            <div class="orderQty">
              <input
                type="number"
                placeholder="Qty"
                class="border border-black p-1 w-16 rounded-md"
                bind:value={qtyValue}
                min="0"
                max={product.product_qty}
              />
            </div>
            <div class="flex justify-between">
              <p class="font-medium m-1">{product.product_price}₹</p>
              <button
                on:click={() => showProd(product)}
                type="button"
                class="text-white -mt-1.5 bg-black focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 hover:bg-gray-700"
                ><svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z"
                    stroke="#ffffff"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg></button
              >
            </div>
          </div>
        </div>
      {/each}
    </div>

    <section class="py-20 font-poppins dark:bg-gray-800">
      <div class="max-w-6xl px-4 mx-auto">
        <div class="flex flex-wrap mb-24 -mx-4">
          <div class="w-full px-4 mb-8 md:w-1/2 md:mb-0">
            <div class="sticky top-0 z-50 overflow-hidden">
              <div class="relative mb-6 lg:mb-10">
                <a
                  class="absolute left-0 transform lg:ml-2 top-1/2 translate-1/2"
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="w-5 h-5 text-blue-500 bi bi-chevron-left dark:text-blue-200"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                    ></path>
                  </svg>
                </a>
                <img
                  class="object-cover w-full lg:h-1/2"
                  src={prdImages}
                  alt=""
                />
                <a
                  class="absolute right-0 transform lg:mr-2 top-1/2 translate-1/2"
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="w-5 h-5 text-blue-500 bi bi-chevron-right dark:text-blue-200"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                    ></path>
                  </svg>
                </a>
              </div>
              <div class="flex-wrap hidden -mx-2 md:flex">
                {#each imgData as img}
                  <div class="w-1/2 p-2 sm:w-1/4">
                    <a
                      class="block border border-transparent hover:border-blue-400"
                      href="#"
                    >
                      <img
                        class="object-cover w-full lg:h-32"
                        src={img.publicUrl}
                        alt=""
                      />
                    </a>
                  </div>
                {/each}
              </div>
              <div
                class="px-6 pb-6 mt-6 border-t border-gray-300 dark:border-gray-400"
              >
                <div class="flex items-center justify-center mt-6">
                  <span class="mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="w-5 h-5 text-blue-700 dark:text-gray-400 bi bi-chat-left-dots-fill"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                      ></path>
                    </svg>
                  </span>
                  <div>
                    <h2
                      class="text-sm font-bold text-gray-700 lg:text-lg dark:text-gray-400"
                    >
                      Have question about buying an {prName}
                    </h2>
                    <a
                      class="text-xs text-blue-400 lg:text-sm dark:text-blue-200"
                      href="#"
                    >
                      Chat with an {prName} specialist
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full px-4 md:w-1/2">
            <div class="lg:pl-20">
              <div class="mb-6">
                <span class="text-red-500 dark:text-red-200">New</span>
                <h2
                  class="max-w-xl mt-2 mb-4 text-5xl font-bold md:text-6xl font-heading dark:text-gray-300"
                >
                  Buy {prName}
                </h2>
                <p class="max-w-md mb-4 text-gray-500 dark:text-gray-400">
                  {prdDesc}
                </p>
              </div>

              <div class="mt-6">
                <div class="flex flex-wrap items-center">
                  <span class="mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="w-4 h-4 text-gray-700 dark:text-gray-400 bi bi-truck"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
                      ></path>
                    </svg>
                  </span>
                  <h2
                    class="text-lg font-bold text-gray-700 dark:text-gray-400"
                  >
                    Delivery
                  </h2>
                </div>
                <div class="px-7">
                  <p class="mb-2 text-sm dark:text-gray-400">In Stock</p>
                  <p class="mb-2 text-sm dark:text-gray-400">Free Shipping</p>
                  <a
                    class="mb-2 text-sm text-blue-400 dark:text-blue-200"
                    href="#">Get delivery dates</a
                  >
                </div>
              </div>
              <div class="mt-6">
                <div class="flex flex-wrap items-center">
                  <span class="mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="w-4 h-4 text-gray-700 dark:text-gray-400 bi bi-bag"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"
                      ></path>
                    </svg>
                  </span>
                  <h2
                    class="text-lg font-bold text-gray-700 dark:text-gray-400"
                  >
                    Pickup
                  </h2>
                </div>
                <div class="px-7">
                  <a
                    class="mb-2 text-sm text-blue-400 dark:text-blue-200"
                    href="#">Check availability</a
                  >
                </div>
              </div>
              <div class="mt-6">
                <button
                  class="w-full px-4 py-2 font-bold text-white bg-blue-400 lg:w-96 hover:bg-blue-500"
                >
                  Continue
                </button>
              </div>
              <div class="flex items-center mt-6">
                <div>
                  <h2
                    class="mb-2 text-lg font-bold text-gray-700 dark:text-gray-400"
                  >
                    Still deciding?
                  </h2>
                  <p class="mb-2 text-sm dark:text-gray-400">
                    Add this item to a list and easily come back to it later
                  </p>
                </div>

                <span class="ml-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-600 dark:hover:text-blue-300 bi bi-bookmark dark:text-gray-400"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"
                    ></path>
                  </svg></span
                >
              </div>
            </div>
          </div>
          <div class="ratingPlatform">
            <div class="yourReview">
              <div class="flex">
                <div class="flex items-center">
                  <svg
                    on:click={() => (userRating = 1)}
                    class="w-4 h-4 {userRating >= 1
                      ? 'text-yellow-500'
                      : 'text-gray-600'} ms-1 transition-all duration-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path
                      d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                    />
                  </svg>
                  <svg
                    on:click={() => (userRating = 2)}
                    class="w-4 h-4 {userRating >= 2
                      ? 'text-yellow-500'
                      : 'text-gray-600'} ms-1 transition-all duration-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path
                      d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                    />
                  </svg>
                  <svg
                    on:click={() => (userRating = 3)}
                    class="w-4 h-4 {userRating >= 3
                      ? 'text-yellow-500'
                      : 'text-gray-600'} ms-1 transition-all duration-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path
                      d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                    />
                  </svg>
                  <svg
                    on:click={() => (userRating = 4)}
                    class="w-4 h-4 {userRating >= 4
                      ? 'text-yellow-500'
                      : 'text-gray-600'} ms-1 transition-all duration-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path
                      d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                    />
                  </svg>
                  <svg
                    on:click={() => (userRating = 5)}
                    class="w-4 h-4 ms-1 {userRating == 5
                      ? 'text-yellow-500'
                      : 'text-gray-600'} transition-all duration-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path
                      d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div class="inpField">
              <input
                type="text"
                placeholder="Enter Review Title"
                bind:value={reviewTitle}
              />
              <input
                type="text"
                placeholder="Enter Review Summary"
                bind:value={reviewSummary}
              />
            </div>
            <button on:click={pushReview}>Submit Your Review</button>

            <div class="reviewRender">
              <div class="flex items-center mb-2">
                <svg
                  class="w-4 h-4 text-yellow-300 me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path
                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                  />
                </svg>
                <svg
                  class="w-4 h-4 text-yellow-300 me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path
                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                  />
                </svg>
                <svg
                  class="w-4 h-4 text-yellow-300 me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path
                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                  />
                </svg>
                <svg
                  class="w-4 h-4 text-yellow-300 me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path
                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                  />
                </svg>
                <svg
                  class="w-4 h-4 text-gray-300 me-1 dark:text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path
                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                  />
                </svg>
                <p
                  class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  4.95
                </p>
                <p
                  class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  out of
                </p>
                <p
                  class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  5
                </p>
              </div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                1,745 global ratings
              </p>
              <div class="flex items-center mt-4">
                <a
                  href="#"
                  class="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >5 star</a
                >
                <div
                  class="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700"
                >
                  <div
                    class="h-5 bg-yellow-300 rounded"
                    style="width: 70%"
                  ></div>
                </div>
                <span
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >70%</span
                >
              </div>
              <div class="flex items-center mt-4">
                <a
                  href="#"
                  class="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >4 star</a
                >
                <div
                  class="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700"
                >
                  <div
                    class="h-5 bg-yellow-300 rounded"
                    style="width: 17%"
                  ></div>
                </div>
                <span
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >17%</span
                >
              </div>
              <div class="flex items-center mt-4">
                <a
                  href="#"
                  class="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >3 star</a
                >
                <div
                  class="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700"
                >
                  <div
                    class="h-5 bg-yellow-300 rounded"
                    style="width: 8%"
                  ></div>
                </div>
                <span
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >8%</span
                >
              </div>
              <div class="flex items-center mt-4">
                <a
                  href="#"
                  class="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >2 star</a
                >
                <div
                  class="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700"
                >
                  <div
                    class="h-5 bg-yellow-300 rounded"
                    style="width: 4%"
                  ></div>
                </div>
                <span
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >4%</span
                >
              </div>
              <div class="flex items-center mt-4">
                <a
                  href="#"
                  class="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >1 star</a
                >
                <div
                  class="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700"
                >
                  <div
                    class="h-5 bg-yellow-300 rounded"
                    style="width: 1%"
                  ></div>
                </div>
                <span
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >1%</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div
      class="checkMarkAnimation w-96 h-16 bg-green-200 fixed bottom-0 ml-2 sm:m-10 md:m-10 lg:m-10 rounded-md transition-all duration-300 shadow-md flex items-center justify-start {orderConfirmation
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-20'}"
    >
      <img src={done} class="w-auto h-8 mx-5" alt="" />
      <div>
        <p class="font-semibold text-green-700">Order Added To Cart.</p>
        <p class="font-medium text-green-700">
          View
          <a href="/Cart" class="underline">Cart</a>
          .
        </p>
      </div>
    </div>
  </div>
</main>
