<script>
  import sgMail from "@sendgrid/mail";
  sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API);

  const msg = {
    to: "geraltofrivia8491@gmail.com", // Recipient's email address
    from: "your_email@example.com", // Your email address
    subject: "Example Subject",
    text: "This is a test email.",
  };

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
