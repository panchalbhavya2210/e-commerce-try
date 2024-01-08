<script>
  import { onMount } from "svelte";
  import imageOne from "../../lib/slider-image/pexels-aline-viana-prado-2465877.webp";
  import imageTwo from "../../lib/slider-image/pexels-daian-gan-102129 (1).webp";
  import imageThree from "../../lib/slider-image/pexels-george-dolgikh-1303082.webp";
  import imageFour from "../../lib/slider-image/pexels-photomix-company-1038628.webp";
  import imageFive from "../../lib/slider-image/pexels-tetyana-kovyrina-12211 (1).webp";
  import transParent from "../../lib/slider-image/—Pngtree—gradient black horizontal vertical_5659215 (1).webp";
  import acEl from "../../lib/category-icons/ac-el.png";
  import clothEl from "../../lib/category-icons/cloth-cl.png";
  import Furniture from "../../lib/category-icons/sofa.png";
  import Book from "../../lib/category-icons/book.png";
  import Groc from "../../lib/category-icons/gro.png";
  import fatal from "../../lib/category-icons/fatal.png";
  import toy from "../../lib/category-icons/toy.png";
  import sport from "../../lib/category-icons/spott.png";
  import pet from "../../lib/category-icons/pet.png";
  import gift from "../../lib/category-icons/gift.png";
  import misc from "../../lib/category-icons/hsh.png";
  import { fade, fly } from "svelte/transition";

  import "../../lib/global.css";
  import supabase from "../../lib";
  let userType,
    rowDataif = 1;
  async function getUidData() {
    let supabaseAuthId = await supabase.auth
      .getUser()
      .then((response) => {
        let authId = response.data.user.id;
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
            const rowData = data[0];
            userType = rowData.user_type;
          } else if (seller && seller.length > 0) {
            const rowData = seller[0];
            userType = rowData.user_type;
          } else {
            rowDataif = 0;
          }
        }
        getData();
      })
      .catch((error) => {
        if (error.message == "Cannot read properties of null (reading 'id')") {
          console.log("User Not Logged In");
        }
      });
  }
  onMount(() => {
    getUidData();
  });

  let currentIndex = 0;

  const slides = [
    {
      text: "Page-Turner Paradise - Dive into Worlds Unseen!",
      link: "Category/Books",
      backgroundImage: imageOne,
      desc: "Immerse yourself in captivating stories, from gripping mysteries to heartwarming tales. Our vast collection caters to all literary tastes, ensuring every reader finds their perfect escape.",
    },
    {
      text: "Chic Threads & Trendy Threads - Flaunt Your Style!",
      link: "Category/Clothing",
      backgroundImage: imageTwo,
      desc: "Elevate your wardrobe with our chic and trendy apparel, curated to reflect the latest fashion trends. Unleash your unique style and make a statement with every outfit.",
    },
    {
      text: "Heartfelt Surprises - Unwrap the Joy of Giving!",
      link: "Category/Gifts",
      backgroundImage: imageThree,
      desc: "Explore a treasure trove of heartfelt surprises, perfect for every occasion. Whether it's birthdays, anniversaries, or celebrations, our curated gifts add a personal touch to your special moments, making them unforgettable.",
    },
    {
      text: "Gizmo Galaxy - Power Up Your Tech Game!",
      link: "Category/Electronics",
      backgroundImage: imageFour,
      desc: "Enter the Gizmo Galaxy, where cutting-edge technology meets your needs. From sleek smartphones to powerful laptops, our electronic selection ensures you stay connected and ahead in the digital realm.",
    },
    {
      text: "Playtime Wonderland - Spark Imagination with Every Toy",
      link: "Category/Toys",
      backgroundImage: imageFive,
      desc: "Dive into a Playtime Wonderland filled with imagination and joy. Our curated toy collection sparks creativity in every child, offering a range of options that entertain, educate, and bring endless smiles.",
    },
  ];
  let time;

  function setInt() {
    time = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
    }, 5000);
  }
  onMount(() => {
    setInt();
  });

  function setSlide(index) {
    currentIndex = index;
    clearInterval(time);
    setInt();
  }

  const categroyItems = [
    {
      text: "Electronics",
      img: acEl,
      link: "/Category/Electronics",
    },
    {
      text: "Clothing & Fashion",
      img: clothEl,
      link: "/Category/Clothing",
    },
    {
      text: "Home & Furniture",
      img: Furniture,
      link: "/Category/Home",
    },
    {
      text: "Books & Media",
      img: Book,
      link: "/Category/Books",
    },
    {
      text: "Groceries & Food",
      img: Groc,
      link: "/Category/Groceries",
    },
    {
      text: "Health & Wellness",
      img: fatal,
      link: "/Category/Health",
    },
    {
      text: "Toys & Games",
      img: toy,
      link: "/Category/Toys",
    },
    {
      text: "Sport & Outdoors",
      img: sport,
      link: "/Category/Sport",
    },
    {
      text: "Pet Supplies",
      img: pet,
      link: "/Category/Pets",
    },
    {
      text: "Gifts",
      img: gift,
      link: "/Category/Gifts",
    },
    {
      text: "Miscellaneous",
      img: misc,
      link: "/Category/Miscellaneous",
    },
  ];
</script>

{#if userType == "User" || userType == null || userType == undefined}
  <main transition:fly={{ y: 200 }}>
    <div class="carouselMain p-4 sm:p-10 h-full">
      <div id="default-carousel" class="relative" data-carousel="slide">
        <div class="relative h-96 overflow-hidden rounded-lg md:h-96">
          {#each slides as { text, backgroundImage, desc, link }, i (i)}
            <div
              class="relative transition-all duration-1000 ease-in-out {i ===
              currentIndex
                ? 'opacity-100'
                : 'opacity-0'}"
            >
              <div class="absolute z-10 overflow-hidden">
                <img
                  src={transParent}
                  class="-rotate-90 mt-10 scale-125"
                  alt=""
                />
                <div
                  class="md:w-96 ml-5 mt-5 w-72 sm:ml-16 sm:mt-10 absolute text-white top-0 left-0 sm:w-5/12 lg:w-5/12"
                >
                  <h1 class="sm:text-3xl mt-5 font-bold">ShopAholic's</h1>
                  <h1 class="sm:mt-2 lg:text-4xl md:text-4xl font-bold text-xl">
                    {text}
                  </h1>
                  <p>{desc}</p>
                  <!-- Add your additional text content here -->

                  <a href={link}>
                    <button class="bg-orange-400 p-1 mt-2 rounded-lg text-black"
                      >Explore</button
                    ></a
                  >
                </div>
              </div>
              <img
                src={backgroundImage}
                class="absolute block w-full top-0 left-0 object-cover h-96"
                alt="..."
              />
            </div>
          {/each}
        </div>
      </div>

      <div
        class="absolute z-30 flex space-x-3 -translate-x-1/2 md:bottom-24 lg:bottom-24 bottom-64 left-1/2"
      >
        {#each slides as _, i (i)}
          <input
            type="radio"
            id="radio-{i}"
            bind:group={currentIndex}
            value={i}
            class="hidden"
            on:change={() => setSlide(i)}
          />
          <label for="radio-{i}"></label>
        {/each}
      </div>
    </div>
    <div class="mt-10 lg:mt-0 md:mt-0">
      <h1 class="text-3xl mb-5 sm:text-4xl font-bold ml-4 sm:mt-16">
        Shop By Category
      </h1>
    </div>
    <div class="categorymenu w-full sm:w-full sm:p-10 md:p-5 mb-5">
      <div
        class="grid grid-cols-1 gap-5 m-auto sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
      >
        {#each categroyItems as categData}
          <div class="rowOne cursor-pointer group transition-all">
            <a href={categData.link} rel="noopener noreferrer">
              <div
                class="categoryOne w-11/12 m-auto sm:w-11/12 rounded-lg h-20 bg-gradient-to-l from-violet-300 to-red-100 flex justify-start items-center"
              >
                <img
                  src={categData.img}
                  alt=""
                  srcset=""
                  class="w-24 h-24 group-hover:w-32 group-hover:h-32 transition-all"
                />
                <p class="text-lg font-medium">{categData.text}</p>
              </div></a
            >
          </div>
        {/each}
      </div>
    </div>
  </main>
{:else}
  <p class="m-5">
    Go to <a href="/ProfilePage" class="underline bold">Profile Page</a> or
    <a href="/ProductCreator" class="underline bold">List Your Product</a> page to
    sell.
  </p>
{/if}

<style>
  input[type="radio"] {
    display: none;
  }

  label {
    cursor: pointer;
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #ffffff;
    border: 2px solid #718096; /* Change this color to your desired border color */
    border-radius: 50%;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  input:checked + label {
    background-color: #000000; /* Change this color to your desired active color */
    border-color: #000000;
  }

  label:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 10px;
    height: 10px;
    background-color: #ffffff;
    border-radius: 50%;
    transition: transform 0.3s ease;
  }

  input:checked + label:after {
    transform: translate(-50%, -50%) scale(1);
  }
</style>
