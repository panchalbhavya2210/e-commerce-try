<script>
  import sgMail from "@sendgrid/mail";
  sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API);

  const msg = {
    to: "Geraltofrivia8491@gmail.com", // Recipient's email address
    from: "VortexDeath@protonmail.com", // Your email address
    subject: "Example Subject",
    text: "This is a test email.",
  };

  console.log(sgMail);

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent successfully");
    })
    .catch((error) => {
      console.error("Email not sent. Error:", error);
    });
</script>

hello
