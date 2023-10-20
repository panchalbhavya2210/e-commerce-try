<script>
  import supabase from "../../lib/index";
  import "../../lib/global.css";
  import { onMount } from "svelte";
  import { blur } from "svelte/transition";

  const dataToInsert = [
    {
      seller_name: "Hello",
      seller_email: "hello@gmail.com",
      seller_image: "pmg",
      seller_category: ["none", "none", "none"],
      seller_products: ["none", "none", "none"],
      seller_price: "2000",
      seller_address: "confidential",
    },
  ];

  async function insertData() {
    const { data, error } = await supabase
      .from("SellerData")
      .upsert(dataToInsert);

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully:", data);
    }
  }
  // insertData();
  onMount(() => {
    // insertData();
    async function fetchData() {
      try {
        // Replace 'your_table_name' with the actual name of your table
        const { data, error } = await supabase
          .from("SellerData")
          .select("seller_category, seller_name, seller_products"); // You can specify specific columns if needed

        if (error) {
          console.error("Error fetching data:", error);
        } else {
          console.log("Data fetched successfully:", data);
          // Process or use the data as needed
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
    // fetchData();
  });
  let emailVal = "panchalbhavya2210@protonmail.com";

  // function checkRegex() {
  //   let regex = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";
  //   console.log(emailVal);

  //   if(emailVal)
  // }
  const validateEmail = (email) => {
    let us = String(email)
      .toLowerCase()
      .match(
        /\b[A-Za-z0-9._%+-]+@(gmail\.com|outlook\.com|yahoo\.com|protonmail\.com)\b/
      );

    if (us == null) {
      alert("Please Enter Correct Format");
    } else {
      alert("Done");
    }
  };
</script>

<main>
  <div class="wrapper">
    <div class="alignAll flex justify-center">
      <div class="headerContainer">
        <h1>Hello</h1>
      </div>
    </div>

    <div class="formContainer">
      <div class="firstTwo sm:flex justify-center">
        <div class="inputF m-auto">
          <label for="firstname">First Name</label>
          <br />
          <input
            type="text"
            name=""
            id="firstname"
            class="m-1 border-2 border-neutral-200 rounded-sm p-1 font-bold outline-black"
          />
        </div>
        <br />
        <div class="inputS">
          <label for="secondname">Second Name</label>
          <br />
          <input
            type="text"
            name=""
            id="secondname"
            class="m-1 border-2 border-neutral-200 rounded-sm p-1 font-bold outline-black"
          />
        </div>
      </div>

      <div class="emailFiedl sm:flex justify-center">
        <div class="inputS">
          <label for="email">Your Email</label>
          <br />
          <input
            type="text"
            name=""
            id="email"
            bind:value={emailVal}
            class="m-1 border-2 border-neutral-200 rounded-sm p-1 font-bold outline-black h-278"
          />
          <p class="text-xs text-gray-600">
            Accepted Domains: <span class="font-bold"
              >gmail.com, yahoo.com, outlook.com, protonmail.com</span
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</main>
