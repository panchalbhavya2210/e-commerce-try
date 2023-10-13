<script>
  import { sineIn } from "svelte/easing";
  import supabase from "../../lib/index";
  import { onMount } from "svelte";

  //   const { data, error } = supabase.auth.signUp({
  //     email: "panchalbhavya2210@gmail.com",
  //     password: "King@2210",
  //   });
  //   console.log(data, error);

  // try {
  //   const { data, error } = supabase.auth.signInWithPassword({
  //     email: "panchalbhavya2210@gmail.com",
  //     password: "King@2210",
  //   });
  //   if (error) {
  //     console.error("Error signing in:", error.message);
  //   } else {
  //     console.log("User signed in successfully:", data);
  //   }
  // } catch (error) {
  //   console.error("Error signing in:", error.message);
  // }

  // try {
  //   const { data, error } = supabase
  //     .from("Seller Data")
  //     .insert([{ "1": "Hello" }]);
  //   if (error) {
  //     console.error("Error signing in:", error.message);
  //   } else {
  //     console.log("data set:", data);
  //   }
  // } catch (error) {
  //   console.log("error when setting database : ", error);
  // }

  const tableName = "SellerData";

  // Data to insert
  const dataToInsert = [
    {
      seller_name: "Hello",
    },
    {
      seller_email: "hello@gmail.com",
    },
    {
      seller_image: "pmg",
    },
    {
      seller_category: [{ "1": "none" }, { "2": "none" }],
    },
    {
      seller_products: [
        {
          "1": "none",
        },
        {
          "1": "none",
        },
      ],
    },
    {
      seller_price: "2000",
    },
    {
      seller_address: "confidentail",
    },
  ];

  // Insert data into the table
  (async () => {
    const { data, error } = await supabase
      .from("SellerData")
      .upsert(dataToInsert);

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully:", data);
    }
  })();
  onMount(() => {
    setTimeout(() => {
      const { data, error } = supabase.from("SellerData").select("*");
      console.log(data);
      console.log(error);
    }, 1500);
  });

  // try {
  //   const { error } = supabase.from("countries").insert([
  //     { id: 1, name: "Nepal" },
  //     { id: 1, name: "Vietnam" },
  //   ]);
  // } catch (error) {
  //   if (error) {
  //     console.error("Error inserting data:", error);
  //   } else {
  //     console.log("Data inserted successfully:", data);
  //   }
  // }
</script>
