<script>
  import { onMount } from "svelte";
  import supabase from "../../lib/index";

  async function Load() {
    const { data, error } = await supabase
      .from("order_table")
      .select("*")
      .eq("seller_id", "835f9919-b5b9-4c58-9166-e37505f59a3c");
    console.log(data);
  }
  onMount(() => {});
</script>

<main />
