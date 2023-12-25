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
</script>

{#if userType == "User" || userType == null || userType == undefined}
  <main transition:fly={{ y: 200 }}>
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.css"
      rel="stylesheet"
    />

    <div class="carouselMain p-4 sm:p-10 h-full">
      <div id="default-carousel" class="relative" data-carousel="slide">
        <!-- Carousel wrapper -->
        <div class="relative h-96 overflow-hidden rounded-lg md:h-96">
          <!-- Item 1 -->
          <div class="relative duration-700 ease-in-out" data-carousel-item>
            <div class="absolute z-10 overflow-hidden">
              <img
                src={transParent}
                class="-rotate-90 mt-10 scale-125"
                alt=""
              />
              <div
                class="ml-5 mt-5 w-72 sm:ml-16 sm:mt-10 absolute text-white top-0 left-0 sm:w-5/12"
              >
                <h1 class="sm:text-3xl font-bold">ShopAholic's</h1>
                <h1 class="-ml-1 sm:mt-2 text-4xl font-bold">
                  Cool Clothing Collection
                </h1>

                <p class="ml-1 mt-4 sm:mt-5">
                  A unique collection of clothing unveils a world of creativity
                  and individuality. These garments defy convention, offering a
                  <br />one-of-a-kind style that stands out in any crowd.
                </p>

                <button
                  class="bg-orange-400 p-1 mt-2 ml-1.5 rounded-lg text-black"
                  >Explore</button
                >
              </div>
            </div>
            <img
              src={imageTwo}
              class="absolute block w-full top-0 left-0 object-cover h-96"
              alt="..."
            />
          </div>
          <!-- Item 2 -->
          <div
            class="relative hidden duration-700 ease-in-out"
            data-carousel-item
          >
            <div class="absolute z-10 overflow-hidden">
              <img
                src={transParent}
                class="-rotate-90 mt-10 scale-125"
                alt=""
              />
              <div
                class="ml-5 mt-5 w-72 sm:ml-16 sm:mt-10 absolute text-white top-0 left-0 sm:w-5/12"
              >
                <h1 class="sm:text-3xl font-bold">ShopAholic's</h1>
                <h1 class="-ml-1 sm:mt-2 text-4xl font-bold">
                  Great Book Collection
                </h1>

                <p class="ml-1 mt-4 sm:mt-5">
                  Our library boasts a rich collection of books, spanning
                  diverse genres, from classics to contemporary bestsellers.
                  With thousands of titles, it caters to a wide range of
                  interests and is a treasure.
                </p>

                <button
                  class="bg-orange-400 p-1 mt-2 ml-1.5 rounded-lg text-black"
                  >Explore</button
                >
              </div>
            </div>
            <img
              src={imageOne}
              class="absolute block w-full top-0 left-0 object-cover h-96"
              alt="..."
            />
          </div>
          <!-- Item 3 -->
          <div
            class="relative hidden duration-700 ease-in-out"
            data-carousel-item
          >
            <div class="absolute z-10">
              <img
                src={transParent}
                class="-rotate-90 mt-10 scale-125"
                alt=""
              />
              <div
                class="ml-5 mt-5 w-72 sm:ml-16 sm:mt-10 absolute text-white top-0 left-0 sm:w-5/12"
              >
                <h1 class="sm:text-3xl font-bold">ShopAholic's</h1>
                <h1 class="-ml-1 sm:mt-2 text-4xl font-bold">
                  Exotic Gifting Collection
                </h1>

                <p class="ml-1 mt-4 sm:mt-5">
                  Our rich collection of gifts offers a diverse array of
                  thoughtful and unique presents for every occasion. From
                  elegant jewelry and personalized keepsakes to tech gadgets and
                  gourmet treats.
                </p>

                <button
                  class="bg-orange-400 p-1 mt-2 ml-1.5 rounded-lg text-black"
                  >Explore</button
                >
              </div>
            </div>
            <img
              src={imageThree}
              class="absolute block w-full top-0 left-0 object-cover h-96"
              alt="..."
            />
          </div>
          <!-- Item 4 -->
          <div
            class="relative hidden duration-700 ease-in-out"
            data-carousel-item
          >
            <div class="absolute z-10">
              <img
                src={transParent}
                class="-rotate-90 mt-10 scale-125"
                alt=""
              />
              <div
                class="ml-5 mt-5 w-72 sm:ml-16 sm:mt-10 absolute text-white top-0 left-0 sm:w-5/12"
              >
                <h1 class="sm:text-3xl font-bold">ShopAholic's</h1>
                <h1 class="-ml-1 sm:mt-2 text-4xl font-bold">
                  Blazing Electric Collection
                </h1>

                <p class="ml-1 mt-4 sm:mt-5">
                  Our electrical appliances boasts a rich collection of
                  cutting-edge devices. From smart home solutions to
                  energy-efficient appliances, we offer a diverse range of
                  products.
                </p>

                <button
                  class="bg-orange-400 p-1 mt-2 ml-1.5 rounded-lg text-black"
                  >Explore</button
                >
              </div>
            </div>
            <img
              src={imageFour}
              class="absolute block w-full top-0 left-0 object-cover h-96"
              alt="..."
            />
          </div>
          <!-- Item 5 -->
          <div
            class="relative hidden duration-700 ease-in-out"
            data-carousel-item
          >
            <div class="absolute z-10">
              <img
                src={transParent}
                class="-rotate-90 mt-10 scale-125"
                alt=""
              />
              <div
                class="ml-5 mt-5 w-72 sm:ml-16 sm:mt-10 absolute text-white top-0 left-0 sm:w-5/12"
              >
                <h1 class="sm:text-3xl font-bold">ShopAholic's</h1>
                <h1 class="-ml-1 sm:mt-2 text-4xl font-bold">KidZone</h1>

                <p class="ml-1 mt-4 sm:mt-5">
                  Our collection of toys and kids' games boasts a rich variety
                  of options to ignite children's imaginations. From educational
                  puzzles and interactive board games to cuddly stuffed animals
                  and creative building sets.
                </p>

                <button
                  class="bg-orange-400 p-1 mt-2 ml-1.5 rounded-lg text-black"
                  >Explore</button
                >
              </div>
            </div>
            <img
              src={imageFive}
              class="absolute block w-full top-0 left-0 object-cover h-96"
              alt="..."
            />
          </div>
        </div>
        <!-- Slider indicators -->
        <div
          class="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2"
        >
          <button
            type="button"
            class="w-3 h-3 rounded-full"
            aria-current="true"
            aria-label="Slide 1"
            data-carousel-slide-to="0"
          />
          <button
            type="button"
            class="w-3 h-3 rounded-full"
            aria-current="false"
            aria-label="Slide 2"
            data-carousel-slide-to="1"
          />
          <button
            type="button"
            class="w-3 h-3 rounded-full"
            aria-current="false"
            aria-label="Slide 3"
            data-carousel-slide-to="2"
          />
          <button
            type="button"
            class="w-3 h-3 rounded-full"
            aria-current="false"
            aria-label="Slide 4"
            data-carousel-slide-to="3"
          />
          <button
            type="button"
            class="w-3 h-3 rounded-full"
            aria-current="false"
            aria-label="Slide 5"
            data-carousel-slide-to="4"
          />
        </div>
      </div>
    </div>
    <div>
      <h1 class="text-3xl mb-5 sm:text-4xl font-bold ml-4 sm:mt-16">
        Shop By Category
      </h1>
    </div>
    <div class="categorymenu w-full sm:w-full sm:p-10 md:p-5">
      <div
        class="grid grid-cols-1 gap-5 m-auto sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
      >
        <div class="rowOne cursor-pointer group transition-all">
          <a href="/Category/Electronics" rel="noopener noreferrer">
            <div
              class="categoryOne w-11/12 m-auto sm:w-11/12 rounded-lg h-20 bg-gradient-to-l from-violet-300 to-red-100 flex justify-start items-center"
            >
              <img
                src={acEl}
                alt=""
                srcset=""
                class="w-32 h-32 group-hover:w-52 group-hover:h-52 transition-all"
              />
              <p class="text-lg font-medium">Electronics</p>
            </div></a
          >
        </div>
        <div class="rowOne cursor-pointer group transition-all">
          <a href="/Category/Clothing">
            <div
              class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-violet-300 to-red-100 flex justify-start items-center"
            >
              <img
                src={clothEl}
                alt=""
                srcset=""
                class="ml-2 w-20 h-20 group-hover:w-32 group-hover:h-32 transition-all"
              />
              <p class="text-lg font-medium">Clothing & Fashion</p>
            </div>
          </a>
        </div>
        <div class="rowOne cursor-pointer group transition-all">
          <a href="/Category/Home">
            <div
              class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-violet-300 to-red-100 flex justify-start items-center"
            >
              <img
                src={Furniture}
                alt=""
                srcset=""
                class="ml-2 w-20 h-20 group-hover:w-32 group-hover:h-32 transition-all"
              />
              <p class="text-lg font-medium">Home & Furniture</p>
            </div>
          </a>
        </div>
        <div class="rowOne cursor-pointer group transition-all">
          <a href="/Category/Books">
            <div
              class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-violet-300 to-red-100 flex justify-start items-center"
            >
              <img
                src={Book}
                alt=""
                srcset=""
                class="ml-2 w-20 h-20 group-hover:w-32 group-hover:h-32 transition-all"
              />
              <p class="text-lg font-medium">Books & Media</p>
            </div>
          </a>
        </div>
        <div class="rowOne cursor-pointer group transition-all">
          <a href="/Category/Groceries">
            <div
              class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-violet-300 to-red-100 flex justify-start items-center"
            >
              <img
                src={Groc}
                alt=""
                srcset=""
                class="ml-2 w-20 h-20 group-hover:w-28 group-hover:h-28 transition-all"
              />
              <p class="text-lg font-medium">Groceries & Food</p>
            </div>
          </a>
        </div>
        <div class="rowOne cursor-pointer group transition-all">
          <a href="/Category/Health">
            <div
              class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-violet-300 to-red-100 flex justify-start items-center"
            >
              <img
                src={fatal}
                alt=""
                srcset=""
                class="ml-2 w-20 h-20 group-hover:w-32 group-hover:h-32 transition-all"
              />
              <p class="text-lg font-medium">Health & Wellness</p>
            </div></a
          >
        </div>
        <div class="rowOne cursor-pointer group transition-all">
          <a href="/Category/Toys">
            <div
              class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-violet-300 to-red-100 flex justify-start items-center"
            >
              <img
                src={toy}
                alt=""
                srcset=""
                class="ml-2 w-20 h-20 group-hover:w-32 group-hover:h-32 transition-all"
              />
              <p class="text-lg font-medium">Toys & Games</p>
            </div></a
          >
        </div>
        <div class="rowOne cursor-pointer group transition-all">
          <a href="/Category/Sports">
            <div
              class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-violet-300 to-red-100 flex justify-start items-center"
            >
              <img
                src={sport}
                alt=""
                srcset=""
                class="ml-2 w-20 h-20 group-hover:w-32 group-hover:h-32 transition-all"
              />
              <p class="text-lg font-medium">Sports & Outdoors</p>
            </div>
          </a>
        </div>
        <div class="rowOne cursor-pointer group transition-all">
          <a href="/Category/Pets">
            <div
              class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-violet-300 to-red-100 flex justify-start items-center"
            >
              <img
                src={pet}
                alt=""
                srcset=""
                class="ml-2 w-20 h-20 group-hover:w-32 group-hover:h-32 transition-all"
              />
              <p class="text-lg font-medium">Pet Supplies</p>
            </div>
          </a>
        </div>
        <div class="rowOne cursor-pointer group transition-all">
          <a href="/Category/Gifts">
            <div
              class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-violet-300 to-red-100 flex justify-start items-center"
            >
              <img
                src={gift}
                alt=""
                srcset=""
                class="ml-2 w-20 h-20 group-hover:w-32 group-hover:h-32 transition-all"
              />
              <p class="text-lg font-medium">Gifts</p>
            </div></a
          >
        </div>
        <div class="rowOne cursor-pointer group transition-all">
          <a href="/Category/Miscellaneous">
            <div
              class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-violet-300 to-red-100 flex justify-start items-center"
            >
              <img
                src={misc}
                alt=""
                srcset=""
                class="ml-2 w-20 h-20 group-hover:w-32 group-hover:h-32 transition-all"
              />
              <p class="text-lg font-medium">Miscellaneous</p>
            </div></a
          >
        </div>
      </div>
    </div>
    <script
      defer
      src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.js"
    ></script>
  </main>
{:else}
  <p class="m-5">
    Go to <a href="/ProfilePage" class="underline bold">Profile Page</a> or
    <a href="/ProductCreator" class="underline bold">List Your Product</a> page to
    sell.
  </p>
{/if}
