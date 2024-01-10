<script>
  import supabase from "../../../lib";
  import "../../../lib/global.css";
  import done from "../../../lib/assets/done-round-svgrepo-com.svg";
  import { fade, fly } from "svelte/transition";
  import { onMount } from "svelte";
  import noProd from "../../../lib/category-icons/no prod.png";

  /**
   * * Now how to convert obj to arry
   * todo : add the update function when user removes the product from thier cart the product qty gets updates
   *
   */
  export let data = [];
  let ratData = [];
  console.log(data);
  let product = data;
  console.log(product.product);
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
  let qtyValue = 0;
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
    qtyValue = 0;
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
      .eq("prd_id", prdId)
      .order("review_date_time", { ascending: false });
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
    if (ratData.length > 0) {
      CalculateRating();
    }
  }

  async function channelSet() {
    const channel = supabase
      .channel("review_table")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "review_table",
        },
        (payload) => {
          ratData = ratData;
          ratData.push(payload.new);
          ratings.push(payload.new.review_stars);
          console.log(ratings);
        }
      )
      .subscribe();
    if (ratData.length != 0 || ratData != undefined) {
      CalculateRating();
    }
    return () => channel.unsubscribe();
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

  let reviewState;

  async function pushReview() {
    reviewState = !reviewState;

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

      if (error == null || error.length == 0) {
        reviewTitle = "";
        userRating = 0;
        reviewSummary = "";

        channelSet();
        btnDecision = true;
        setTimeout(() => {
          CalculateRating();
        }, 500);
        reviewState = !reviewState;
      }
    }
    console.log(prdId);
  }

  async function addCart() {
    let supabaseAuthId = await supabase.auth.getUser().then((response) => {
      let authId = response.data.user.id;
      array.push(prdId);
      // array.push(prd.id);
      prd_qt.push("1");

      let cartDataToInsert = {
        auth_id: authId,
        product_id: prdId,
        product_qty: qtyValue,
      };
      if (qtyValue <= 0 || qtyValue == undefined || qtyValue == null) {
        console.log("add qty first");
      } else if (qtyValue > prd.product_qty) {
        console.log("ORder Quantity Cannot be greater than stock Quantity");
      } else {
        async function road() {
          const { data, error } = await supabase
            .from("CartData")
            .insert(cartDataToInsert);

          const { data: prod, er } = await supabase
            .from("ProductData")
            .update({
              product_qty: prQty - qtyValue,
            })
            .eq("id", prdId);
          console.log(prod, er);

          if (error == null) {
            orderConfirmation = true;
          }
        }
        for (let index = 0; index < qtyValue; index++) {
          road();
        }
        setTimeout(() => {
          orderConfirmation = false;
        }, 3400);
      }
    });
  }

  let viewLength = ratData.length,
    source;
  function loadMoreReview() {
    viewLength = ratData.length;
  }
  function dynamicImgUrl(url) {
    source = url;
  }

  let img, lens, output, x, y, cx, cy;

  onMount(() => {
    img = document.getElementById("box");
    output = document.getElementById("box2");
    lens = document.querySelector("#box .square");

    let imgUrl = window.getComputedStyle(img).backgroundImage;

    cx = output.offsetWidth / lens.offsetWidth;
    cy = output.offsetHeight / lens.offsetHeight;

    output.style.display = "none";

    output.style.backgroundImage = imgUrl;
    output.style.backgroundSize =
      cx * img.offsetWidth + "px " + cy * img.offsetHeight + "px";

    const commandFunc = (e) => {
      output.style.display = "initial";

      x = e.pageX - img.getBoundingClientRect().left - lens.offsetWidth / 2;
      y = e.pageY - img.getBoundingClientRect().top - lens.offsetHeight / 2;

      if (x < 0) {
        x = 0;
      }

      if (y < 0) {
        y = 0;
      }

      if (x > img.offsetWidth - lens.offsetWidth) {
        x = img.offsetWidth - lens.offsetWidth;
      }

      if (y > img.offsetHeight - lens.offsetHeight) {
        y = img.offsetHeight - lens.offsetHeight;
      }

      lens.style.top = y + "px";
      lens.style.left = x + "px";

      output.style.backgroundPositionY = -(y * cy) + "px";
      output.style.backgroundPositionX = -(x * cx) + "px";
    };

    const hideZoomImage = () => {
      output.style.display = "none";
    };

    img.addEventListener("mousemove", commandFunc);
    img.addEventListener("mouseout", hideZoomImage);
    img.addEventListener("touchmove", commandFunc);

    return () => {
      // Cleanup event listeners on component destroy
      img.removeEventListener("mousemove", commandFunc);
      img.removeEventListener("mouseout", hideZoomImage);
      img.removeEventListener("touchmove", commandFunc);
    };
  });
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
    {#if product.product.length == 0}
      <div class="flex items-center justify-center w-full h-full">
        <div class="text-center">
          <img
            src={noProd}
            alt="No Category Icon"
            class="mx-auto w-auto h-44 mb-4"
          />

          <h2 class="text-2xl font-semibold mb-2">
            No products available for this category
          </h2>
          <p class="text-gray-600">
            Check back later or explore <a href="/" class="underline"
              >other categories.</a
            >
          </p>
        </div>
      </div>
    {:else}
      <div
        class="grid grid-cols-1 gap-5 m-auto sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 {modalBring
          ? 'hidden'
          : 'block'}"
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
    {/if}

    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <section
      class="font-poppins fixed overflow-x-hidden h-full left-0 bg-white w-full transition-all duration-500 {modalBring
        ? ' -bottom-0 opacity-100'
        : ' -bottom-full opacity-0'}"
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

              <div id="box" class="boxHai" style="background: url({source});">
                <span class="square"></span>
              </div>

              <div id="box2" class="dusraBox" />

              <div class="flex-wrap flex -mx-2 md:flex -z-0">
                {#each imgData as img}
                  <div class="w-auto p-2 sm:w-1/4 lg:w-auto md:w-auto">
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <img
                      class="rounded-md object-cover w-auto h-20 lg:h-32 transition-all cursor-pointer"
                      src={img.publicUrl}
                      alt=""
                      on:click={dynamicImgUrl(img.publicUrl)}
                    />
                  </div>
                {/each}
              </div>

              <div class="px-6 pb-6 mt-6 border-t border-gray-300"></div>
            </div>
          </div>
          <div class="w-full px-4 md:w-1/2">
            <div class="lg:pl-20">
              <div class="mb-6">
                <h2
                  class="max-w-xl mt-4 mb-4 text-5xl font-bold md:text-6xl font-heading"
                >
                  {prName}
                </h2>
                <p class="max-w-md mb-4 text-gray-800 font-medium text-4xl">
                  ₹ {prPrice}
                </p>
                <p class="max-w-md mb-4 text-gray-800">
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

              <!-- Input Number -->
              <div
                class="py-2 px-3 bg-gray-100 w-56 rounded-lg"
                data-hs-input-number
              >
                <div class="w-full flex justify-between items-center gap-x-5">
                  <div class="grow">
                    <input
                      class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 font-bold"
                      type="number"
                      bind:value={qtyValue}
                      max={prQty}
                      readonly
                      data-hs-input-number-input
                      min="0"
                    />
                  </div>
                  <div class="flex justify-end items-center gap-x-1.5">
                    <button
                      type="button"
                      class="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      data-hs-input-number-decrement
                      on:click={() =>
                        qtyValue == 0 ? (qtyValue = 0) : qtyValue--}
                    >
                      <svg
                        class="flex-shrink-0 w-3.5 h-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"><path d="M5 12h14" /></svg
                      >
                    </button>
                    <button
                      type="button"
                      class="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      data-hs-input-number-increment
                      on:click={() => qtyValue++}
                    >
                      <svg
                        class="flex-shrink-0 w-3.5 h-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><path d="M5 12h14" /><path d="M12 5v14" /></svg
                      >
                    </button>
                  </div>
                </div>
              </div>
              <!-- End Input Number -->
              <div class="mt-6">
                <button
                  on:click={addCart}
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
                    class="w-full lg:w-96 p-2 border my-1 font-semibold outline-none border-black"
                  />
                  <br />
                  <textarea
                    type="text"
                    placeholder="Enter Review Summary"
                    bind:value={reviewSummary}
                    class="w-full lg:w-96 p-2 border my-1 font-medium outline-none border-black"
                  ></textarea>
                  <br />
                  <input
                    bind:files
                    type="file"
                    multiple
                    class="w-full lg:w-96 border font-medium outline-none border-black"
                    accept="image/jpeg, video/mkv, image/jpg, image/png, image/svg"
                  />
                </div>
                <!--                   disabled={btnDecision || reviewState} -->
                <button
                  class="w-full lg:w-96 flex justify-center items-center p-2 border mt-2 font-medium outline-none border-black bg-black text-white transition-all duration-500 {btnDecision
                    ? 'bg-gray-500'
                    : 'hover:bg-white hover:text-black'}"
                  disabled={reviewState || btnDecision}
                  on:click={pushReview}
                >
                  <div
                    role="status"
                    class=" {reviewState ? 'block' : 'hidden'}"
                  >
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
                  {#if btnDecision}
                    Review Already Submitted
                  {:else if reviewState}
                    Submitting Your Review
                  {:else}
                    Submit Your Review
                  {/if}
                </button>
                {#if ratData.length == 0 || ratData == undefined}
                  <p class="hidden">No Review Yet.</p>
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
                <p class="mt-2">Be the first one to review</p>
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
      class="checkMarkAnimation w-96 h-16 z-50 bg-green-200 fixed bottom-0 ml-2 sm:m-10 md:m-10 lg:m-10 rounded-md transition-all duration-300 shadow-md flex items-center justify-start {orderConfirmation
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

<style>
  .boxHai#box {
    background: url();
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
    height: 500px;
    width: 600px;
    margin: 10px;
    position: relative;
    float: left;
  }

  .boxHai#box .square {
    display: block;
    position: absolute;

    height: 200px;
    width: 200px; /* 200px  relative to the parent width*/
    background-color: #8b1b0d;
    opacity: 0.4;
    border: 2px solid #fff;
    cursor: pointer;
  }

  .dusraBox#box2 {
    height: 800px;
    width: 600px;
    margin: 10px;
    position: relative;
    float: left;
    overflow: hidden;
    transition: all 0.1s ease-in-out;
  }
</style>
