<script>
  import supabase from "../../../lib";
  import "../../../lib/global.css";
  import done from "../../../lib/assets/done-round-svgrepo-com.svg";
  import { fade, fly } from "svelte/transition";
  import { onMount } from "svelte";

  /**
   * * Now how to convert obj to arry
   * todo : add the update function when user removes the product from thier cart the product qty gets updates
   *
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
  let uimglink, uname, udate, uemail, formattedDate, auth_id;
  async function dataC() {
    let supabaseId = await supabase.auth
      .getUser()
      .then((response) => {
        auth_id = response.data.user.id;
        async function getData() {
          const { data, error } = await supabase
            .from("user_auth_data")
            .select("*")
            .eq("auth_uid", auth_id);

          uimglink = data[0].user_profile;
          uname = data[0].user_name;
          udate = data[0].created_at;
          const date = new Date(udate);

          // Format the date as dd/mm/yyyy
          formattedDate = `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;
          console.log(uimglink, uname, formattedDate);
        }
        getData();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  onMount(() => {
    dataC();
  });
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
    userRating,
    reviewTitle,
    reviewSummary,
    files,
    fileName,
    file,
    btnDecision,
    modalBring;
  async function showProd(prdDaata) {
    viewLength = 2;
    modalBring = true;
    source = prdDaata.product_image_d;
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
    ratings = [];
    btnDecision;

    ratData = data;
    if (ratData.length == 0) {
      btnDecision = false;
    }
    console.log(ratData);
    for (let i = 0; i < ratData.length; i++) {
      let checkUserReview = ratData[i].u_id;
      if (checkUserReview == auth_id) {
        btnDecision = true;
        console.log(btnDecision);
      } else {
        btnDecision = false;
        console.log(btnDecision);
      }
      ratings.push(ratData[i].review_stars);
    }
    setTimeout(() => {
      CalculateRating();
    }, 2000);
  }

  let ratingPercentages = {};
  let ratingCounts = {
    "1star": 0,
    "2star": 0,
    "3star": 0,
    "4star": 0,
    "5star": 0,
  };
  let roundedRating;
  function CalculateRating() {
    ratingPercentages = {};
    ratingCounts = {
      "1star": 0,
      "2star": 0,
      "3star": 0,
      "4star": 0,
      "5star": 0,
    };
    roundedRating;
    console.log(ratings);
    const averageRating =
      ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    roundedRating = Math.min(Math.round(averageRating * 2) / 2, 5);

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

    for (const key in ratingCounts) {
      ratingPercentages[key] = Math.floor(
        (ratingCounts[key] / totalRatings) * 100
      );
    }
    console.log(ratingPercentages);
    console.log(roundedRating);
    console.log(ratingCounts);
  }

  let date = new Date();
  let month = date.getMonth() + 1;
  let dateDecider =
    date.getDate() +
    "/" +
    month +
    "/" +
    date.getFullYear() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes();

  async function pushReview() {
    let imageArray = [];

    if (files != undefined) {
      for (let i = 0; i < files.length; i++) {
        fileName = files[i].name;
        file = files[i];

        const { data, error } = await supabase.storage
          .from("review_img")
          .upload(`review_img/${fileName}`, file);

        const { data: dataOne } = await supabase.storage
          .from("review_img")
          .getPublicUrl(`review_img/${fileName}`);
        imageArray.push(dataOne);

        console.log(dataOne);
      }

      const reviewToInsert = {
        prd_id: prdId,
        isVerified: "1",
        u_id: auth_id,
        review_title: reviewTitle,
        review_desc: reviewSummary,
        review_image: imageArray,
        review_stars: userRating,
        user_name: uname,
        user_image: uimglink,
        user_joined: formattedDate,
        review_date_time: dateDecider,
      };
      const { data, error } = await supabase
        .from("review_table")
        .insert(reviewToInsert);
      console.log(data, error);
    }
    console.log(prdId);
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

  let viewLength = 2,
    source;
  function loadMoreReview() {
    viewLength = ratData.length;
  }
  function dynamicImgUrl(url) {
    source = url;
  }
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
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="rowOne cursor-pointer group transition-all"
          on:click={() => showProd(product)}
        >
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

    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <section
      class="font-poppins fixed overflow-auto h-full left-0 bg-white w-full transition-all duration-500 {modalBring
        ? ' -bottom-0'
        : ' -bottom-full'}"
    >
      <div
        class="sticky w-full top-0 left-0 h-20 flex justify-center items-start z-50 lg:ml-5 md:ml-5"
      >
        <svg
          on:click={() => (modalBring = !modalBring)}
          viewBox="0 0 24 24"
          fill="none"
          class="w-auto h-16 bg-gray-300 p-3 rounded-bl-full rounded-br-full cursor-pointer z-50"
          xmlns="http://www.w3.org/2000/svg"
          ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g><g id="SVGRepo_iconCarrier">
            <path
              d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
              fill="#0F0F0F"
            ></path>
          </g></svg
        >
      </div>
      <div class="max-w-6xl px-4 mx-auto">
        <div class="flex flex-wrap mb-24 -mx-4">
          <div class="w-full px-4 mb-8 md:w-1/2 md:mb-0">
            <div class="sticky top-0 z-50 overflow-hidden">
              <div class="relative mb-6 lg:mb-10">
                <img
                  class="object-cover w-full lg:h-1/2 -z-10 shadow-xl rounded-md"
                  src={source}
                  alt=""
                />
              </div>
              <div class="flex-wrap hidden -mx-2 md:flex -z-0">
                {#each imgData as img}
                  <div class="w-1/2 p-2 sm:w-1/4">
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <img
                      class="rounded-md object-cover w-full lg:h-32 transition-all"
                      src={img.publicUrl}
                      alt=""
                      on:click={dynamicImgUrl(img.publicUrl)}
                    />
                  </div>
                {/each}
              </div>
              <div class="px-6 pb-6 mt-6 border-t border-gray-300">
                <div class="flex items-center justify-center mt-6">
                  <span class="mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="w-5 h-5 text-blue-700 bi bi-chat-left-dots-fill"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                      ></path>
                    </svg>
                  </span>
                  <div>
                    <h2 class="text-sm font-bold text-gray-700 lg:text-lg">
                      Have question about buying an {prName}
                    </h2>
                    <a class="text-xs text-blue-400 lg:text-sm" href="a">
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
                <h2
                  class="max-w-xl mt-4 mb-4 text-5xl font-bold md:text-6xl font-heading"
                >
                  Buy {prName}
                </h2>
                <p class="max-w-md mb-4 text-gray-500">
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
                      class="w-4 h-4 text-gray-700 bi bi-truck"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
                      ></path>
                    </svg>
                  </span>
                  <h2 class="text-lg font-bold text-gray-700">Delivery</h2>
                </div>
                <div class="px-7">
                  <p class="mb-2 text-sm">In Stock</p>
                  <p class="mb-2 text-sm">Free Shipping</p>
                  <a class="mb-2 text-sm text-blue-400" href="a"
                    >Get delivery dates</a
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
                      class="w-4 h-4 text-gray-700 bi bi-bag"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"
                      ></path>
                    </svg>
                  </span>
                  <h2 class="text-lg font-bold text-gray-700">Pickup</h2>
                </div>
                <div class="px-7">
                  <a class="mb-2 text-sm text-blue-400" href="a"
                    >Check availability</a
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
                  <h2 class="mb-2 text-lg font-bold text-gray-700">
                    Still deciding?
                  </h2>
                  <p class="mb-2 text-sm">
                    Add this item to a list and easily come back to it later
                  </p>
                </div>

                <span class="ml-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-600 bi bi-bookmark"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"
                    ></path>
                  </svg></span
                >
              </div>
              <div class="ratingPlatform">
                <div class="yourReview">
                  <div>
                    <h1 class="mb-2 text-xl font-bold text-gray-700">
                      Add Your Review
                    </h1>
                  </div>
                  <div class="flex">
                    <div class="flex items-center mb-3">
                      <svg
                        on:click={() => (userRating = 1)}
                        class="w-auto h-6 {userRating >= 1
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
                        class="w-auto h-6 {userRating >= 2
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
                        class="w-auto h-6 {userRating >= 3
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
                        class="w-auto h-6 {userRating >= 4
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
                        class="w-auto h-6 ms-1 {userRating == 5
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
                      <p class="ml-2">
                        {#if userRating == 1}
                          Poor
                        {:else if userRating == 2}
                          Fair
                        {:else if userRating == 3}
                          Good
                        {:else if userRating == 4}
                          Very Good
                        {:else if userRating == 5}
                          Excellent
                        {/if}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="inpField">
                  <input
                    type="text"
                    placeholder="Enter Review Title"
                    bind:value={reviewTitle}
                    class="w-full p-2 border my-1 font-semibold outline-none border-black"
                  />
                  <br />
                  <textarea
                    type="text"
                    placeholder="Enter Review Summary"
                    bind:value={reviewSummary}
                    class="w-full p-2 border my-1 font-medium outline-none border-black"
                  ></textarea>
                  <br />
                  <input
                    bind:files
                    type="file"
                    multiple
                    class="w-full border font-medium outline-none border-black"
                    accept="image/jpeg, video/mp4, video/mkv, image/jpg, image/png, image/svg"
                  />
                </div>
                <button
                  class="w-full p-2 border mt-2 font-medium outline-none border-black bg-black text-white transition-all duration-500 {btnDecision
                    ? 'bg-gray-500'
                    : 'hover:bg-white hover:text-black'}"
                  on:click={pushReview}
                  disabled={btnDecision}
                  >{btnDecision
                    ? "Review Already Submitted"
                    : "Submit Your Review"}</button
                >
                {#if ratData.length == 0 || ratData == undefined}
                  <p class="hidden">Nothing TO disp;au</p>
                {:else}
                  <div class="reviewRender">
                    <div class="flex items-center mb-2 mt-2">
                      <svg
                        class="w-4 h-4 {roundedRating >= 1
                          ? 'text-yellow-400'
                          : 'text-gray-500'} me-1"
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
                        class="w-4 h-4 {roundedRating >= 2
                          ? 'text-yellow-400'
                          : 'text-gray-500'} me-1"
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
                        class="w-4 h-4 {roundedRating >= 3
                          ? 'text-yellow-400'
                          : 'text-gray-500'} me-1"
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
                        class="w-4 h-4 {roundedRating >= 4
                          ? 'text-yellow-400'
                          : 'text-gray-500'} me-1"
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
                        class="w-4 h-4 {roundedRating == 5
                          ? 'text-yellow-400'
                          : 'text-gray-500'} me-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path
                          d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                        />
                      </svg>
                      <p class="ms-1 text-sm font-medium text-gray-500">
                        {roundedRating}
                      </p>
                      <p class="ms-1 text-sm font-medium text-gray-500">
                        out of
                      </p>
                      <p class="ms-1 text-sm font-medium text-gray-500">5</p>
                    </div>
                    <p class="text-sm font-medium text-gray-500">
                      {ratData.length} total ratings
                    </p>
                    <div class="flex items-center mt-4">
                      <a
                        href="a"
                        class="text-sm font-medium text-blue-600 hover:underline"
                        >5 star</a
                      >
                      <div class="w-2/4 h-5 mx-4 bg-gray-200 rounded">
                        <div
                          class="h-5 bg-yellow-300 rounded"
                          style="width: {ratingPercentages['5star']}%"
                        ></div>
                      </div>
                      <span class="text-sm font-medium text-gray-500"
                        >{ratingPercentages["5star"]}%</span
                      >
                    </div>
                    <div class="flex items-center mt-4">
                      <a
                        href="a"
                        class="text-sm font-medium text-blue-600 hover:underline"
                        >4 star</a
                      >
                      <div class="w-2/4 h-5 mx-4 bg-gray-200 rounded">
                        <div
                          class="h-5 bg-yellow-300 rounded"
                          style="width: {ratingPercentages['4star']}%"
                        ></div>
                      </div>
                      <span class="text-sm font-medium text-gray-500"
                        >{ratingPercentages["4star"]}%</span
                      >
                    </div>
                    <div class="flex items-center mt-4">
                      <a
                        href="a"
                        class="text-sm font-medium text-blue-600 hover:underline"
                        >3 star</a
                      >
                      <div class="w-2/4 h-5 mx-4 bg-gray-200 rounded">
                        <div
                          class="h-5 bg-yellow-300 rounded"
                          style="width: {ratingPercentages['3star']}%"
                        ></div>
                      </div>
                      <span class="text-sm font-medium text-gray-500"
                        >{ratingPercentages["3star"]}%</span
                      >
                    </div>
                    <div class="flex items-center mt-4">
                      <a
                        href="a"
                        class="text-sm font-medium text-blue-600 hover:underline"
                        >2 star</a
                      >
                      <div class="w-2/4 h-5 mx-4 bg-gray-200 rounded">
                        <div
                          class="h-5 bg-yellow-300 rounded"
                          style="width: {ratingPercentages['2star']}%"
                        ></div>
                      </div>
                      <span class="text-sm font-medium text-gray-500"
                        >{ratingPercentages["2star"]}%</span
                      >
                    </div>
                    <div class="flex items-center mt-4">
                      <a
                        href="a"
                        class="text-sm font-medium text-blue-600 hover:underline"
                        >1 star</a
                      >
                      <div class="w-2/4 h-5 mx-4 bg-gray-200 rounded">
                        <div
                          class="h-5 bg-yellow-300 rounded transition-all duration-500"
                          style="width: {ratingPercentages['1star']}%"
                        ></div>
                      </div>
                      <span class="text-sm font-medium text-gray-500"
                        >{ratingPercentages["1star"]}%</span
                      >
                    </div>
                  </div>
                {/if}
              </div>
              {#if ratData.length == 0 || ratData == undefined}
                <p>Be THe First One TO Review</p>
              {:else}
                {#each ratData.slice(0, viewLength) as rating}
                  <article>
                    <div class="flex items-center mb-4">
                      <img
                        class="w-10 h-10 me-4 rounded-full"
                        src={rating.user_image}
                        alt=""
                      />
                      <div class="font-medium dark:text-white">
                        <p>
                          {rating.user_name}
                          <time
                            datetime="2014-08-16 19:00"
                            class="block text-sm text-gray-500 dark:text-gray-400"
                            >Joined on {rating.user_joined}</time
                          >
                        </p>
                      </div>
                    </div>
                    <div
                      class="flex items-center mb-1 space-x-1 rtl:space-x-reverse"
                    >
                      <svg
                        class="w-4 h-4 {rating.review_stars >= 1
                          ? 'text-yellow-400'
                          : 'text-gray-500'}"
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
                        class="w-4 h-4 {rating.review_stars >= 2
                          ? 'text-yellow-400'
                          : 'text-gray-500'}"
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
                        class="w-4 h-4 {rating.review_stars >= 3
                          ? 'text-yellow-400'
                          : 'text-gray-500'}"
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
                        class="w-4 h-4 {rating.review_stars >= 4
                          ? 'text-yellow-400'
                          : 'text-gray-500'}"
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
                        class="w-4 h-4 {rating.review_stars == 5
                          ? 'text-yellow-400'
                          : 'text-gray-500'}"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path
                          d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                        />
                      </svg>
                      <h3 class="ms-2 text-sm font-semibold text-gray-900">
                        {rating.review_title}
                      </h3>
                    </div>
                    <div class="img flex overflow-x-scroll">
                      {#each rating.review_image as i}
                        <img
                          src={i.publicUrl}
                          alt=""
                          class="w-auto h-24 mx-2 rounded-md shadow-md"
                        />
                      {/each}
                      <!-- <img src={rating.review_image.publicUrl} alt="" srcset="" /> -->
                    </div>
                    <footer class="mb-5 text-sm text-gray-900">
                      <p>
                        Reviewed at <time datetime="2017-03-03 19:00"
                          >{rating.review_date_time}</time
                        >
                      </p>
                    </footer>
                    <p class="mb-2 text-gray-500 dark:text-gray-400">
                      {rating.review_desc}
                    </p>
                  </article>
                  <div class="line w-full h-0.5 bg-gray-300 my-2"></div>
                {/each}
              {/if}
              <button
                class={viewLength >= ratData.length ? "hidden" : "block"}
                on:click={loadMoreReview}>Load More</button
              >
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
