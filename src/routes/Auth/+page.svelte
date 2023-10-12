<script>
  import supabase from "../../lib/index";

  //   const { data, error } = supabase.auth.signUp({
  //     email: "panchalbhavya2210@gmail.com",
  //     password: "King@2210",
  //   });
  //   console.log(data, error);

  try {
    const { data, error } = supabase.auth.signInWithPassword({
      email: "panchalbhavya2210@gmail.com",
      password: "King@2210",
    });
    if (error) {
      console.error("Error signing in:", error.message);
    } else {
      console.log("User signed in successfully:", data);
    }
  } catch (error) {
    console.error("Error signing in:", error.message);
  }

  //   try {
  //     const { error } = supabase.from("Seller Data").insert({
  //       seller_name: "Bhavya Panchal",
  //       seller_email: "panchalbhavya2210@gmail.com",
  //       seller_image: "https://picsum.photos/200",
  //       seller_category: {
  //         "1": "Food",
  //         "2": "Eat",
  //         "3": "Get",
  //       },
  //       seller_products: {
  //         "1": "Food",
  //         "2": "Eat",
  //         "3": "Get",
  //       },
  //       seller_price: "69000",
  //       seller_address: "221B Baker Street",
  //     });
  //     if (error) {
  //       console.error("Error signing in:", error.message);
  //     } else {
  //       console.log("User signed in successfully:", data);
  //     }
  //   } catch (error) {
  //     console.log("error when setting database : ", error);
  //   }
  const { data, error } = supabase.from("Seller Data").insert([
    {
      seller_name: "Bhavya Panchal",
      seller_email: "panchalbhavya2210@gmail.com",
      seller_image: "https://picsum.photos/200",
      seller_category: {
        "1": "Food",
        "2": "Eat",
        "3": "Get",
      },
      seller_products: {
        "1": "Food",
        "2": "Eat",
        "3": "Get",
      },
      seller_price: "69000",
      seller_address: "221B Baker Street",
    },
  ]);

  if (error) {
    console.error("Error inserting data:", error);
  } else {
    console.log("Data inserted successfully:", data);
  }
</script>
