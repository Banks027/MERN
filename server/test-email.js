require("dotenv").config();

const {
    sendVerificationEmail,
} = require("./utils/email");

(async () => {

    try {

        const result =
            await sendVerificationEmail({

                to: "roman.d.quintero@gmail.com",

                displayName: "Roman",

                verificationCode: "483921",

            });

        console.log(result);

    } catch (err) {

        console.error(err);

    }

})();