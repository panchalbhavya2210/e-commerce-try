<script>
  import { onMount } from "svelte";
  import "../../lib/global.css";
  import supabase from "../../lib/index";

  let img;
  let userType,
    rowDataif = 1;
  async function getUidData() {
    let supabaseAuthId = await supabase.auth.getUser().then((response) => {
      let authId = response.data.user.id;
      console.log(authId);
      async function getData() {
        const { data, error } = await supabase
          .from("user_auth_data")
          .select("*")
          .eq("auth_uid", authId);
        const { data: seller, error: serror } = await supabase
          .from("seller_auth_data")
          .select("*")
          .eq("auth_uid", authId);
        console.log(seller);

        if (data && data.length > 0) {
          const rowData = data[0];
          img = rowData.user_profile;
          userType = rowData.user_type;
        } else if (seller && seller.length > 0) {
          const rowData = seller[0];
          console.log(rowData);
          img = rowData.seller_image;
          userType = rowData.user_type;
        } else {
          rowDataif = 0;
        }
      }
      getData();
    });
  }
  onMount(() => {
    setTimeout(() => {
      getUidData();
    }, 1500);
  });
</script>

<main>
  <div class="profileCard">
    <div class="profileImg flex items-center justify-center w-full h-40">
      <img
        src={img}
        alt=""
        class="w-auto h-32 rounded-full border border-gray-400 p-2"
      />
    </div>
  </div>
</main>
