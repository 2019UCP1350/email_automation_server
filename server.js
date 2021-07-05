require("./models/User");
const mongoose = require("mongoose");
const node_cron = require("node-cron");
const User = require("./models/User");
const nodemailer = require("nodemailer");

mongoose.connect(
  "mongodb+srv://kunal:eYp77JfAa_kNxDH@cluster0.vt5fl.mongodb.net/flipper?retryWrites=true",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("connected", () => {
  console.log("connected to mongo instance");
});

mongoose.connection.on("error", (err) => {
  console.error("Error conneting monoogoose", err);
});
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ezymail.mailer@gmail.com",
    pass: "bhandari",
  },
});
const arr = [0, 20000, 604800000, 18144000000, 217728000000];
const sendemail = async() => {
  try {
     node_cron.schedule("30 * * * * *",async () => {
      let data = await User.find();
      for (var i = 0; i < data.length; i++) {
        const sender_email = data[i].email;
        let maillist = data[i].emailList;
        let flag = 0;
        for (var j = 0; j < maillist.length; j++) {
          let email = maillist[j];
          const now = Date.now();
          let flag2 = 0;
          if (now - email.time >= arr[parseInt(email.schedule)]) {
            flag2 = 1;
            flag = 1;
            const content = email.content;
            const receiver_list = email.to.concat(email.cc);
            for (var k = 0; k < receiver_list.length; k++) {
              var mailoptions = {
                from: sender_email,
                to: receiver_list[k],
                subject: email.subject,
                html: content,
              };
              transporter.sendMail(mailoptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent" + info.response);
                }
              });
            }
          }
          if (flag2) {
            email.date = now;
          }
        }
        if (flag) {
          User.updateOne(
            { email: sender_email },
            { emailList: maillist },
            (err, res) => {
              if (err) {
                console.log(err);
                return;
              }
              console.log("success doing data change");
            }
          );
        }
      }
     });
  } catch (e) {
    console.log("error sending email");
  }
};
sendemail();
