<script>
  import { onMount } from "svelte";
  import "../../lib/global.css";
  import { stripe } from "../stripe";

  async function getTry() {
    const session = stripe.checkout.sessions.retrieve(session_id);
    console.log(session);
  }

  onMount(() => {
    getTry();
  });
</script>

<!-- Display the retrieved data in the component -->

<!-- Add other components or elements to display additional data -->
