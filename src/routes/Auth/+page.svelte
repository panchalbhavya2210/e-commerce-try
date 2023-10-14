<script>
  import { sineIn } from "svelte/easing";
  import supabase from "../../lib/index";
  import { onMount } from "svelte";

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

  // Insert data into the table
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
    fetchData();
  });
</script>
