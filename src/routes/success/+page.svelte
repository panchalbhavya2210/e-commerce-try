<script>
  import "../../lib/global.css";
  import supabase from "../../lib";
  // async function order() {
  //   const randomDecimal = Math.random();
  //   const otp = Math.floor(randomDecimal * 1000000);
  //   for (let i = 0; i < seller_id.length; i++) {
  //     const orderDataToInsert = {
  //       customer_name: recFName + " " + recLName,
  //       customer_address: recAddres,
  //       customer_phone: recPhone,
  //       customer_city: recCity,
  //       customer_pin: recPin,
  //       customer_email: recEmail,
  //       seller_id: seller_id[i],
  //       product_ids: prdId[i],
  //       user_id: user_id,
  //       product_name: product_name[i],
  //       product_desc: product_desc[i],
  //       product_image: product_img[i],
  //       product_price: product_price[i],
  //       order_status: "Pending",
  //       customer_otp: otp,
  //       ordered_qty: arrCount[prdId[i]],
  //       invoice_amt: totalAmount,
  //     };
  //     console.log(orderDataToInsert);
  //     const { data, error } = await supabase
  //       .from("order_table")
  //       .insert(orderDataToInsert);

  //     for (let i = 0; i < prdId.length; i++) {
  //       const { data: deleted } = await supabase
  //         .from("CartData")
  //         .delete()
  //         .eq("product_id", prdId[i]);
  //     }
  //     ocTemp = error;
  //     console.log(data, error);
  //   }
  //   if (ocTemp == null && addArr.length != 0) {
  //     orderConfirmation = !orderConfirmation;
  //     setTimeout(() => {
  //       orderConfirmation = !orderConfirmation;
  //     }, 5000);
  //   } else if (addArr.length == 0) {
  //     orderError = !orderError;
  //     setTimeout(() => {
  //       orderError = !orderError;
  //     }, 5000);
  //   } else {
  //     alert("Something Went Wrong");
  //   }
  // }
</script>
