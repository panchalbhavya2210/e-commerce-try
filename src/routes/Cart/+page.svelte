<script>
  import supabase from "../../lib";

  async function getCartData() {
    const { data, error } = await supabase
      .from("CartData")
      .select("*")
      .eq("auth_uid", 1);

    console.log(data[0].product_id);

    let er = data[0].product_id;

    async function getProductData() {
      const { data, error1 } = await supabase
        .from("ProductData")
        .select("*")
        .eq("id", er);

      console.log(data);
    }

    getProductData();
  }

  getCartData();
</script>
