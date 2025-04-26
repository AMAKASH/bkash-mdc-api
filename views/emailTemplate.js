const loginEmailTemplate = (otp) => {
  const html = `
<!DOCTYPE html>
<html lang="en-US">
    <head>
        <meta charset="UTF-8" />
        <title>Moments with Maa OTP Email Template</title>
        <meta name="description" content="Reset Password Email Template." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        <style type="text/css">
            a:hover {
                text-decoration: underline !important;
            }

            table {
                width: 100%;
                text-align: center;
            }
        </style>
    </head>

    <body style="margin: 0px; background-color: #f2f3f8;">
        <table style="font-family: 'Open Sans', sans-serif;">
        
        
        
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width: 670px; margin: 0 auto;" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td>

                                <br />
                                <table width="95%" cellpadding="0" cellspacing="0" style="max-width: 570px; background: #fff; border-radius: 3px; vertical-align: middle; display: inline-flex; box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);">
                                    <tr>
                                        <td style="padding: 0 35px;">
                                            <div style="margin: 20px 0px;">
                                                <span>
                                                                                <img src="https://ik.imagekit.io/02vodkf4s/bkash_mothers_day/pnemonic.png"
  alt="pnemonic" style="width:30%">
                                                </span>
                                            </div>
                                            <h1 style="color: #455056; font-weight: 500; margin: 0; font-size: 15px; font-family: 'Rubik', sans-serif; text-align: start;">Hi,</h1>
                                            <h1 style="color: #455056; font-weight: 500; margin-top: 10px; font-size: 15px; font-family: 'Rubik', sans-serif; text-align: justify; line-height: 2;">
                                                Thank you for signing up with Moments with Maa! To complete your registration, please use the following One Time Password (OTP) to verify your email address:
                                            </h1>
                                            <br />
                                            <h1 style="color: #455056; font-weight: 500; margin-top: 10px; font-size: 36px; font-family: Arial, Helvetica, sans-serif; text-align: center; line-height: 1;">
                                                <span style="font-weight: 400; color: #e2116e;">${otp}</span>
                                            </h1>
                                            <br />
                                            <span style="margin: 29px 0 26px; border-bottom: 1px solid #cecece; width: 100px;"></span>
                                            <h1 style="color: #455056; font-weight: 500; margin-top: 2px; font-size: 15px; font-family: 'Rubik', sans-serif; text-align: justify; line-height: 2;">
                                                We’re thrilled to have you join our journey of celebrating beautiful moments with mothers. Let’s create something special together!
                                            </h1>
                                            <br />
                                            <h1 style="color: #455056; font-weight: 500; margin-top: 2px; margin-bottom: 20px; font-size: 15px; font-family: 'Rubik', sans-serif; text-align: justify; line-height: 2;">
                                                Warm regards, <br> The <i>Moments with Maa</i> Team
                                            </h1>
                                        </td>
                                    </tr>

                                </table>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>
`;

  return html;
};

module.exports = loginEmailTemplate;
