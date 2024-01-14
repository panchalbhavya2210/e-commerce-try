<script>
  import { onMount } from "svelte";
  import "../../lib/global.css";
  import brevo from "@getbrevo/brevo";
  import supabase from "../../lib";
  async function updatePayment() {
    const response = await supabase.auth.getUser();
    const authId = response.data.user.id;
    const { data, error } = await supabase
      .from("order_table")
      .update({ payment_status: "paid" })
      .eq("user_id", authId);

    console.log(data, error);
  }

  onMount(() => {
    updatePayment();
  });
  function sendMail() {
    let defaultClient = brevo.ApiClient.instance;

    let apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey =
      "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";

    let apiInstance = new brevo.TransactionalEmailsApi();
    let sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "My {{params.subject}}";
    sendSmtpEmail.htmlContent = `<html><body><h1>Common: This is my first transactional email ${name}</h1></body></html>`;
    sendSmtpEmail.sender = {
      name: "ShopAholic",
      email: "geraltofrivia8491@gmail.com",
    };
    sendSmtpEmail.to = [
      { email: "panchalbhavya2210@gmail.com", name: "Bhavya Panchal" },
    ];
    sendSmtpEmail.replyTo = { email: "no-reply@gmail.com", name: "NoReply" };
    sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
    sendSmtpEmail.params = {
      parameter: "Order Confirmation",
      subject: "Order Confirmation",
    };

    apiInstance.sendTransacEmail(sendSmtpEmail).then(
      function (data) {
        console.log(
          "API called successfully. Returned data: " + JSON.stringify(data)
        );
      },
      function (error) {
        console.error(error);
      }
    );
  }
</script>

<!-- Display the retrieved data in the component -->

<!-- Add other components or elements to display additional data -->
