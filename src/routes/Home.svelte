<script>
  import { onMount } from "svelte";
  import imageOne from "../lib/slider-image/pexels-daian-gan-102129.jpg";
  import imageTwo from "../lib/slider-image/pexels-dom-j-45982.jpg";
  import imageThree from "../lib/slider-image/pexels-kai-pilger-996329.jpg";
  import imageFour from "../lib/slider-image/pexels-polina-tankilevitch-3735641.jpg";
  import imageFive from "../lib/slider-image/pexels-sam-lion-5709665.jpg";
  import transParent from "../lib/slider-image/—Pngtree—gradient black horizontal vertical_5659215.png";
  import acEl from "../lib/category-icons/ac-el.png";
  import clothEl from "../lib/category-icons/cloth-cl.png";
  import Furniture from "../lib/category-icons/sofa.png";
  import Book from "../lib/category-icons/book.png";
  import Groc from "../lib/category-icons/gro.png";
  import fatal from "../lib/category-icons/fatal.png";
  import toy from "../lib/category-icons/toy.png";
  import sport from "../lib/category-icons/spott.png";
  import pet from "../lib/category-icons/pet.png";
  import gift from "../lib/category-icons/gift.png";
  import misc from "../lib/category-icons/hsh.png";

  import "../lib/global.css";
</script>

<main>
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
            <img src={transParent} class="-rotate-90 scale-110" alt="" />
            <div
              class="ml-5 mt-5 w-72 sm:ml-16 sm:mt-10 absolute text-white top-0 left-0 sm:w-5/12"
            >
              <h1 class="sm:text-3xl font-bold">ShopAholic's</h1>
              <h1 class="-ml-1 sm:mt-2 text-5xl font-bold">
                Clothing Collection
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
            src={imageOne}
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
            <img src={transParent} class="-rotate-90 scale-110" alt="" />
            <div
              class="ml-5 mt-5 w-72 sm:ml-16 sm:mt-10 absolute text-white top-0 left-0 sm:w-5/12"
            >
              <h1 class="sm:text-3xl font-bold">ShopAholic's</h1>
              <h1 class="-ml-1 sm:mt-2 text-5xl font-bold">
                Clothing Collection
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
        <!-- Item 3 -->
        <div
          class="relative hidden duration-700 ease-in-out"
          data-carousel-item
        >
          <div class="absolute z-10">
            <img src={transParent} class="-rotate-90 scale-110" alt="" />
            <div
              class="ml-5 mt-5 w-72 sm:ml-16 sm:mt-10 absolute text-white top-0 left-0 sm:w-5/12"
            >
              <h1 class="sm:text-3xl font-bold">ShopAholic's</h1>
              <h1 class="-ml-1 sm:mt-2 text-5xl font-bold">
                Clothing Collection
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
            <img src={transParent} class="-rotate-90 scale-110" alt="" />
            <div
              class="ml-5 mt-5 w-72 sm:ml-16 sm:mt-10 absolute text-white top-0 left-0 sm:w-5/12"
            >
              <h1 class="sm:text-3xl font-bold">ShopAholic's</h1>
              <h1 class="-ml-1 sm:mt-2 text-5xl font-bold">
                Clothing Collection
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
            <img src={transParent} class="-rotate-90 scale-110" alt="" />
            <div
              class="ml-5 mt-5 w-72 sm:ml-16 sm:mt-10 absolute text-white top-0 left-0 sm:w-5/12"
            >
              <h1 class="sm:text-3xl font-bold">ShopAholic's</h1>
              <h1 class="-ml-1 sm:mt-2 text-5xl font-bold">
                Clothing Collection
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
      <!-- Slider controls -->
    </div>
  </div>

  <div class="categorymenu w-full sm:w-full sm:p-10 md:p-5">
    <div
      class="grid grid-cols-1 gap-4 m-auto sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
    >
      <div class="rowOne cursor-pointer group transition-all">
        <div
          class="categoryOne w-11/12 m-auto sm:w-11/12 rounded-lg h-20 bg-gradient-to-l from-red-300 to-red-400 flex justify-start items-center"
        >
          <img
            src={acEl}
            alt=""
            srcset=""
            class="w-32 h-32 group-hover:w-52 group-hover:h-52 transition-all"
          />
          <p class="text-lg font-bold">Electronics</p>
        </div>
      </div>
      <div class="rowOne cursor-pointer group transition-all">
        <div
          class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-orange-300 to-orange-400 flex justify-start items-center"
        >
          <img
            src={clothEl}
            alt=""
            srcset=""
            class="ml-2 w-20 h-20 group-hover:w-32 group-hover:h-32 transition-all"
          />
          <p class="text-lg font-bold">Clothing & Fashion</p>
        </div>
      </div>
      <div class="rowOne cursor-pointer group transition-all">
        <div
          class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-lime-300 to-lime-400 flex justify-start items-center"
        >
          <img
            src={Furniture}
            alt=""
            srcset=""
            class="ml-2 w-20 h-20 group-hover:w-32 group-hover:h-32 transition-all"
          />
          <p class="text-lg font-bold">Home & Furniture</p>
        </div>
      </div>
      <div class="rowOne cursor-pointer group transition-all">
        <div
          class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-green-300 to-green-400 flex justify-start items-center"
        >
          <img
            src={Book}
            alt=""
            srcset=""
            class="ml-2 w-20 h-20 group-hover:w-32 group-hover:h-32 transition-all"
          />
          <p class="text-lg font-bold">Books & Media</p>
        </div>
      </div>
      <div class="rowOne cursor-pointer group transition-all">
        <div
          class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-teal-300 to-teal-400 flex justify-start items-center"
        >
          <img
            src={Groc}
            alt=""
            srcset=""
            class="ml-2 w-20 h-20 group-hover:w-28 group-hover:h-28 transition-all"
          />
          <p class="text-lg font-bold">Groceries & Food</p>
        </div>
      </div>
      <div class="rowOne cursor-pointer group transition-all">
        <div
          class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-cyan-300 to-cyan-400 flex justify-start items-center"
        >
          <img
            src={fatal}
            alt=""
            srcset=""
            class="ml-2 w-20 h-20 group-hover:w-32 group-hover:h-32 transition-all"
          />
          <p class="text-lg font-bold">Health & Wellness</p>
        </div>
      </div>
      <div class="rowOne cursor-pointer group transition-all">
        <div
          class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-indigo-300 to-indigo-400 flex justify-start items-center"
        >
          <img
            src={toy}
            alt=""
            srcset=""
            class="ml-2 w-20 h-20 group-hover:w-32 group-hover:h-32 transition-all"
          />
          <p class="text-lg font-bold">Toys & Games</p>
        </div>
      </div>
      <div class="rowOne cursor-pointer group transition-all">
        <div
          class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-purple-300 to-purple-400 flex justify-start items-center"
        >
          <img
            src={sport}
            alt=""
            srcset=""
            class="ml-2 w-20 h-20 group-hover:w-32 group-hover:h-32 transition-all"
          />
          <p class="text-lg font-bold">Sports & Outdoors</p>
        </div>
      </div>
      <div class="rowOne cursor-pointer group transition-all">
        <div
          class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-red-300 to-red-400 flex justify-start items-center"
        >
          <img
            src={pet}
            alt=""
            srcset=""
            class="ml-2 w-20 h-20 group-hover:w-32 group-hover:h-32 transition-all"
          />
          <p class="text-lg font-bold">Pet Supplies</p>
        </div>
      </div>
      <div class="rowOne cursor-pointer group transition-all">
        <div
          class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-violet-300 to-violet-400 flex justify-start items-center"
        >
          <img
            src={gift}
            alt=""
            srcset=""
            class="ml-2 w-20 h-20 group-hover:w-32 group-hover:h-32 transition-all"
          />
          <p class="text-lg font-bold">Gifts</p>
        </div>
      </div>
      <div class="rowOne cursor-pointer group transition-all">
        <div
          class="categoryOne w-11/12 m-auto sm:11/12 rounded-lg h-20 bg-gradient-to-l from-blue-300 to-blue-400 flex justify-start items-center"
        >
          <img
            src={misc}
            alt=""
            srcset=""
            class="ml-2 w-20 h-20 group-hover:w-32 group-hover:h-32 transition-all"
          />
          <p class="text-lg font-bold">Miscellaneous</p>
        </div>
      </div>
    </div>
  </div>
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.js"
  ></script>
</main>
