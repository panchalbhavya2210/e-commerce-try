<script>
  import supabase from "../../lib/index";
  import "../../lib/global.css";

  async function deleteOrderData() {
    const auth = await supabase.auth.getUser();
    const id = auth.data.user.id;
  }
</script>
