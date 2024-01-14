<script>
  import supabase from "../../lib/index";
  import "../../lib/global.css";

  async function order() {
    const randomDecimal = Math.random();
    const otp = Math.floor(randomDecimal * 1000000);
    for (let i = 0; i < seller_id.length; i++) {
      const orderDataToInsert = {
        seller_id: seller_id[i],
        address_id: bindRadio,
        product_ids: prdId[i],
        user_id: user_id,
        product_name: product_name[i],
        product_desc: product_desc[i],
        product_image: product_img[i],
        product_price: product_price[i],
        order_status: "Pending",
        customer_otp: otp,
        ordered_qty: arrCount[prdId[i]],
        invoice_amt: totalAmount,
        payment_status: "unpaid",
      };
      console.log(orderDataToInsert);
      const { data, error } = await supabase
        .from("order_table")
        .insert(orderDataToInsert);
      for (let i = 0; i < prdId.length; i++) {
        // const { data: deleted } = await supabase
        //   .from("CartData")
        //   .delete()
        //   .eq("product_id", prdId[i]);
      }
      ocTemp = error;
      console.log(data, error);
    }
    if (ocTemp == null && addArr.length != 0) {
      orderConfirmation = !orderConfirmation;
      setTimeout(() => {
        orderConfirmation = !orderConfirmation;
      }, 5000);
    } else if (addArr.length == 0) {
      orderError = !orderError;
      setTimeout(() => {
        orderError = !orderError;
      }, 5000);
    } else {
      alert("Something Went Wrong");
    }
  }
</script>
