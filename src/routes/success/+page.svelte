<script>
  import { onMount } from "svelte";
  import "../../lib/global.css";
  import brevo from "@getbrevo/brevo";
  import supabase from "../../lib";
  import done from "../../lib/assets/done-round-svgrepo-com.svg";

  let isVerified = false;

  let addressData = [];
  let addArr = [];
  let arrCount = [];
  let totalAmount;
  let prdId = [];
  let seller_id = [];
  let product_name = [],
    product_desc = [],
    product_price = [],
    product_img = [],
    prdQty = [],
    user_email;
  let userName;
  let user_id, orderConfirmation, ocTemp, orderError;

  let removerState = false;

  async function getCartData() {
    try {
      const countMap = {};
      arrCount = countMap;

      const response = await supabase.auth.getUser();
      const authId = response.data.user.id;
      const { data: udata, error: uerror } = await supabase
        .from("user_auth_data")
        .select("*")
        .eq("auth_uid", authId);
      userName = udata[0].user_name;

      user_id = response.data.user.id;
      const { data: cartData, error } = await supabase
        .from("CartData")
        .select("*")
        .eq("auth_id", authId);

      const fetchArr = cartData.map((item) => item.product_id);

      fetchArr.forEach((element) => {
        if (countMap[element] || removerState == true) {
          countMap[element]++;
        } else {
          countMap[element] = 1;
        }
      });

      for (const key in countMap) {
        if (countMap[key] > 1) {
        }
      }
      console.log(countMap);

      const { data: productData } = await supabase
        .from("ProductData")
        .select("*")
        .in("id", fetchArr);

      addArr = productData;
      console.log(addArr);
      for (let i = 0; i < addArr.length; i++) {
        product_name.push(productData[i].product_name);
        product_desc.push(productData[i].product_description);
        product_price.push(productData[i].product_price);
        product_img.push(productData[i].product_image_d);
        prdId.push(productData[i].id);
        seller_id.push(productData[i].seller_id);
      }

      totalAmount = 0;
      for (const product of addArr) {
        if (countMap[product.id]) {
          totalAmount += product.product_price * countMap[product.id];
        }
      }
      if (totalAmount < 100 && addArr.length != 0) {
        totalAmount = totalAmount + 50;
      } else {
        totalAmount = totalAmount;
      }
      console.log(arrCount);
    } catch (error) {}
  }

  async function fetchAddress() {
    const { data, error } = await supabase
      .from("address_data")
      .select("*")
      .eq("user_id", user_id);

    console.log(data, error);
    addressData = data;
  }

  let bindRadio;
  function changeValue(data) {
    bindRadio = data.id;
  }

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
        payment_status: "paid",
      };
      console.log(orderDataToInsert);
      const { data, error } = await supabase
        .from("order_table")
        .insert(orderDataToInsert);
      for (let i = 0; i < prdId.length; i++) {
        const { data: deleted } = await supabase
          .from("CartData")
          .delete()
          .eq("product_id", prdId[i]);
      }
      ocTemp = error;
      console.log(data, error);
      console.log(ocTemp);
    }
    if (ocTemp == null && addArr.length != 0) {
      orderConfirmation = !orderConfirmation;
      console.log(orderConfirmation);
      setTimeout(() => {
        orderConfirmation = !orderConfirmation;
      }, 5000);
    } else if (addArr.length == 0) {
    } else {
      alert("Something Went Wrong");
    }
    sendMail();
  }
  onMount(() => {
    getCartData();
    setTimeout(() => {
      fetchAddress();
    }, 1500);
  });
  function sendMail() {
    let defaultClient = brevo.ApiClient.instance;

    let apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = import.meta.env.VITE_BREVO_KEY;

    let apiInstance = new brevo.TransactionalEmailsApi();
    let sendSmtpEmail = new brevo.SendSmtpEmail();

    const data = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="format-detection" content="telephone=no"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Your Order Confirmation</title><style type="text/css" emogrify="no">#outlook a { padding:0; } .ExternalClass { width:100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } table td { border-collapse: collapse; mso-line-height-rule: exactly; } .editable.image { font-size: 0 !important; line-height: 0 !important; } .nl2go_preheader { display: none !important; mso-hide:all !important; mso-line-height-rule: exactly; visibility: hidden !important; line-height: 0px !important; font-size: 0px !important; } body { width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; } img { outline:none; text-decoration:none; -ms-interpolation-mode: bicubic; } a img { border:none; } table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; } th { font-weight: normal; text-align: left; } *[class="gmail-fix"] { display: none !important; } </style><style type="text/css" emogrify="no"> @media (max-width: 600px) { .gmx-killpill { content: ' 03D1';} } </style><style type="text/css" emogrify="no">@media (max-width: 600px) { .gmx-killpill { content: ' 03D1';} .r0-o { border-style: solid !important; margin: 0 auto 0 auto !important; width: 320px !important } .r1-i { background-color: #dfdfdf !important } .r2-c { box-sizing: border-box !important; text-align: center !important; valign: top !important; width: 100% !important } .r3-o { border-style: solid !important; margin: 0 auto 0 auto !important; width: 100% !important } .r4-i { padding-bottom: 20px !important; padding-left: 15px !important; padding-right: 15px !important; padding-top: 20px !important } .r5-c { box-sizing: border-box !important; display: block !important; valign: top !important; width: 100% !important } .r6-o { border-style: solid !important; width: 100% !important } .r7-i { padding-left: 0px !important; padding-right: 0px !important } .r8-i { padding-bottom: 15px !important; padding-top: 15px !important } .r9-i { padding-bottom: 20px !important; padding-left: 0px !important; padding-right: 0px !important; padding-top: 20px !important } .r10-c { box-sizing: border-box !important; text-align: left !important; valign: top !important; width: 100% !important } .r11-o { border-style: solid !important; margin: 0 auto 0 0 !important; width: 100% !important } .r12-i { padding-top: 15px !important; text-align: center !important } .r13-c { box-sizing: border-box !important; padding-top: 15px !important; text-align: left !important; valign: top !important; width: 100% !important } .r14-c { box-sizing: border-box !important; padding-bottom: 15px !important; padding-top: 15px !important; text-align: left !important; valign: top !important; width: 100% !important } .r15-c { box-sizing: border-box !important; padding: 0 !important; text-align: center !important; valign: top !important; width: 100% !important } .r16-o { border-style: solid !important; margin: 0 auto 0 auto !important; margin-bottom: 15px !important; margin-top: 15px !important; width: 100% !important } .r17-i { padding: 0 !important; text-align: center !important } .r18-r { background-color: #1B1B1B !important; border-radius: 4px !important; border-width: 0px !important; box-sizing: border-box; height: initial !important; padding: 0 !important; padding-bottom: 12px !important; padding-left: 5px !important; padding-right: 5px !important; padding-top: 12px !important; text-align: center !important; width: 100% !important } .r19-i { background-color: #eff2f7 !important; padding-bottom: 20px !important; padding-left: 15px !important; padding-right: 15px !important; padding-top: 20px !important } .r20-i { padding-bottom: 0px !important; padding-top: 15px !important; text-align: center !important } .r21-i { padding-bottom: 0px !important; padding-top: 0px !important; text-align: center !important } .r22-c { box-sizing: border-box !important; text-align: center !important; width: 100% !important } .r23-i { padding-bottom: 15px !important; padding-left: 0px !important; padding-right: 0px !important; padding-top: 0px !important } .r24-c { box-sizing: border-box !important; text-align: center !important; valign: top !important; width: 129px !important } .r25-o { border-style: solid !important; margin: 0 auto 0 auto !important; width: 129px !important } body { -webkit-text-size-adjust: none } .nl2go-responsive-hide { display: none } .nl2go-body-table { min-width: unset !important } .mobshow { height: auto !important; overflow: visible !important; max-height: unset !important; visibility: visible !important; border: none !important } .resp-table { display: inline-table !important } .magic-resp { display: table-cell !important } } </style><style type="text/css">p, h1, h2, h3, h4, ol, ul { margin: 0; } a, a:link { color: #696969; text-decoration: underline } .nl2go-default-textstyle { color: #3b3f44; font-family: arial,helvetica,sans-serif; font-size: 16px; line-height: 1.5; word-break: break-word } .default-button { color: #ffffff; font-family: arial,helvetica,sans-serif; font-size: 16px; font-style: normal; font-weight: normal; line-height: 1.15; text-decoration: none; word-break: break-word } .default-heading1 { color: #1F2D3D; font-family: arial,helvetica,sans-serif; font-size: 36px; word-break: break-word } .default-heading2 { color: #1F2D3D; font-family: arial,helvetica,sans-serif; font-size: 32px; word-break: break-word } .default-heading3 { color: #1F2D3D; font-family: arial,helvetica,sans-serif; font-size: 24px; word-break: break-word } .default-heading4 { color: #1F2D3D; font-family: arial,helvetica,sans-serif; font-size: 18px; word-break: break-word } a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; } .no-show-for-you { border: none; display: none; float: none; font-size: 0; height: 0; line-height: 0; max-height: 0; mso-hide: all; overflow: hidden; table-layout: fixed; visibility: hidden; width: 0; } </style><!--[if mso]><xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><style type="text/css">a:link{color: #696969; text-decoration: underline;}</style></head><body bgcolor="#dfdfdf" text="#3b3f44" link="#696969" yahoo="fix" style="background-color: #dfdfdf;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" class="nl2go-body-table" width="100%" style="background-color: #dfdfdf; width: 100%;"><tr><td> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="600" align="center" class="r0-o" style="table-layout: fixed; width: 600px;"><tr><td valign="top" class="r1-i" style="background-color: #dfdfdf;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" align="center" class="r3-o" style="table-layout: fixed; width: 100%;"><tr><td class="r4-i" style="padding-bottom: 20px; padding-top: 20px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><th width="100%" valign="top" class="r5-c" style="font-weight: normal;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r6-o" style="table-layout: fixed; width: 100%;"><tr><td valign="top" class="r7-i" style="padding-left: 15px; padding-right: 15px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><td class="r2-c" align="center"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="176" class="r3-o" style="table-layout: fixed; width: 176px;"><tr><td class="r8-i" style="font-size: 0px; line-height: 0px; padding-bottom: 15px; padding-top: 15px;"> <img src="https://raw.githubusercontent.com/panchalbhavya2210/e-commerce-try/main/src/lib/Screenshot_2023-10-15_162702-transformed-removebg-preview.png" width="176" border="0" style="display: block; width: 100%;"></td> </tr></table></td> </tr></table></td> </tr></table></th> </tr></table></td> </tr></table><table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" align="center" class="r3-o" style="table-layout: fixed; width: 100%;"><tr><td class="r9-i" style="padding-bottom: 20px; padding-top: 20px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><th width="100%" valign="top" class="r5-c" style="font-weight: normal;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r6-o" style="table-layout: fixed; width: 100%;"><tr><td valign="top" class="r7-i" style="padding-left: 15px; padding-right: 15px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><td class="r10-c" align="left"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r11-o" style="table-layout: fixed; width: 100%;"><tr><td align="center" valign="top" class="r12-i nl2go-default-textstyle" style="color: #3b3f44; font-family: arial,helvetica,sans-serif; font-size: 16px; line-height: 1.5; word-break: break-word; padding-top: 15px; text-align: center;"> <div><h1 class="default-heading1" style="margin: 0; color: #1f2d3d; font-family: arial,helvetica,sans-serif; font-size: 36px; word-break: break-word;">Your Order Has Been Placed.</h1></div> </td> </tr></table></td> </tr></table></td> </tr></table></th> </tr></table></td> </tr></table><table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" align="center" class="r3-o" style="table-layout: fixed; width: 100%;"><tr><td class="r9-i" style="padding-bottom: 20px; padding-top: 20px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><th width="100%" valign="top" class="r5-c" style="font-weight: normal;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r6-o" style="table-layout: fixed; width: 100%;"><tr><td valign="top" class="r7-i" style="padding-left: 10px; padding-right: 10px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><td class="r13-c nl2go-default-textstyle" align="left" style="color: #3b3f44; font-family: arial,helvetica,sans-serif; font-size: 16px; line-height: 1.5; word-break: break-word; padding-top: 15px; text-align: left; valign: top;"> <div><h2 class="default-heading2" style="margin: 0; color: #1f2d3d; font-family: arial,helvetica,sans-serif; font-size: 32px; word-break: break-word;">Dear ${userName},</h2></div> </td> </tr><tr><td class="r14-c nl2go-default-textstyle" align="left" style="color: #3b3f44; font-family: arial,helvetica,sans-serif; font-size: 16px; line-height: 1.5; word-break: break-word; padding-bottom: 15px; padding-top: 15px; text-align: left; valign: top;"> <div><p style="margin: 0;">Your Order Has Been Placed &amp; Will Arrive In 7 Working Days.</p></div> </td> </tr><tr><td class="r15-c" align="center" style="align: center; padding-bottom: 15px; padding-top: 15px; valign: top;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="290" class="r16-o" style="background-color: #1B1B1B; border-collapse: separate; border-color: #1B1B1B; border-radius: 4px; border-style: solid; border-width: 0px; table-layout: fixed; width: 290px;"><tr><td height="18" align="center" valign="top" class="r17-i nl2go-default-textstyle" style="word-break: break-word; background-color: #1B1B1B; border-radius: 4px; color: #ffffff; font-family: arial,helvetica,sans-serif; font-size: 16px; font-style: normal; line-height: 1.15; padding-bottom: 12px; padding-left: 5px; padding-right: 5px; padding-top: 12px; text-align: center;"> <a href="https://e-commerce-try.vercel.app/OrderStatus" class="r18-r default-button" target="_blank" data-btn="1" style="font-style: normal; font-weight: normal; line-height: 1.15; text-decoration: none; word-break: break-word; word-wrap: break-word; display: block; -webkit-text-size-adjust: none; color: #ffffff; font-family: arial,helvetica,sans-serif; font-size: 16px;"> <span>Check Status</span></a> </td> </tr></table></td> </tr></table></td> </tr></table></th> </tr></table></td> </tr></table><table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" align="center" class="r3-o" style="table-layout: fixed; width: 100%;"><tr><td class="r19-i" style="background-color: #eff2f7; padding-bottom: 20px; padding-top: 20px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><th width="100%" valign="top" class="r5-c" style="font-weight: normal;"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r6-o" style="table-layout: fixed; width: 100%;"><tr><td valign="top" class="r7-i" style="padding-left: 15px; padding-right: 15px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><td class="r10-c" align="left"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r11-o" style="table-layout: fixed; width: 100%;"><tr><td align="center" valign="top" class="r20-i nl2go-default-textstyle" style="color: #3b3f44; font-family: arial,helvetica,sans-serif; word-break: break-word; font-size: 18px; line-height: 1.5; padding-top: 15px; text-align: center;"> <div><p style="margin: 0;">ShopAholic Team</p></div> </td> </tr></table></td> </tr><tr><td class="r10-c" align="left"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r11-o" style="table-layout: fixed; width: 100%;"><tr><td align="center" valign="top" class="r21-i nl2go-default-textstyle" style="color: #3b3f44; font-family: arial,helvetica,sans-serif; word-break: break-word; font-size: 18px; line-height: 1.5; text-align: center;"> <div><p style="margin: 0; font-size: 14px;">Ahmedabad, Gujarat</p></div> </td> </tr></table></td> </tr><tr><td class="r10-c" align="left"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r11-o" style="table-layout: fixed; width: 100%;"><tr><td align="center" valign="top" class="r20-i nl2go-default-textstyle" style="color: #3b3f44; font-family: arial,helvetica,sans-serif; word-break: break-word; font-size: 18px; line-height: 1.5; padding-top: 15px; text-align: center;"> <div><p style="margin: 0; font-size: 14px;">This email was sent to {{contact.EMAIL}}</p></div> </td> </tr></table></td> </tr><tr><td class="r22-c" align="center"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" align="center" class="r3-o" style="table-layout: fixed; width: 100%;"><tr><td valign="top" class="r23-i" style="padding-bottom: 15px;"> <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tr><td class="r24-c" align="center"> <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="129" class="r25-o" style="table-layout: fixed;"><tr><td height="48" style="font-size: 0px; line-height: 0px;"> </td> </tr></table></td> </tr></table></td> </tr></table></td> </tr></table></td> </tr></table></th> </tr></table></td> </tr></table></td> </tr></table></td> </tr></table></body></html>
`;

    sendSmtpEmail.subject = "Order Placed";
    sendSmtpEmail.htmlContent = data;
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

<main>
  <div class="p-5">
    <div>
      <h1 class="font-semibold">All Done.</h1>
      <h2>Just Select Your Address.</h2>
    </div>
  </div>
  <div class="px-5">
    {#each addressData as data}
      <div class="">
        <div class="radioData">
          <div
            class="full w-full my-2 border-black border rounded-md flex justify-start"
          >
            <div class="radioItself ml-3 w-10 flex items-start">
              <input
                type="radio"
                name="address_radio"
                class="mt-3 w-5 h-5"
                on:change={changeValue(data)}
                selected={bindRadio}
              />
            </div>
            <div class="data mt-2 mb-2">
              <p class="font-semibold">{data.address_title}</p>
              <p>{data.reciever_name}</p>
              <p>{data.address_details}</p>
              <p>{data.rec_city}</p>
              <p>{data.user_phone}</p>
              <p>{data.pin_code}</p>
            </div>
          </div>
        </div>
      </div>
    {/each}
    <button
      on:click={order}
      class="w-full flex items-center justify-center rounded-md border border-transparent bg-gray-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-700"
      >Confirm Your Order</button
    >
  </div>
  <div
    class="checkMarkAnimation w-96 h-16 bg-green-200 fixed bottom-0 ml-2 sm:m-10 md:m-10 lg:m-10 rounded-md transition-all duration-300 shadow-md flex items-center justify-start {orderConfirmation
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-20'}"
  >
    <img src={done} class="w-auto h-8 mx-5" alt="" />
    <div>
      <p class="font-semibold text-green-700">Thanks! Order Placed.</p>
      <p class="font-medium text-green-700">
        View
        <a href="/OrderStatus" class="underline">Order Status</a>
        .
      </p>
    </div>
  </div>
</main>
<!-- Add other components or elements to display additional data -->
