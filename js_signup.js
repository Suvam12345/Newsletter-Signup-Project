const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");

const app=express();

app.use(express.static("public")); //so that we can use local files (eg. "css/css_signup.css", "img_signup/logo.png") in browser. "css/css_signup.css", "img_signup/logo.png" are inside folder "public".
app.use(bodyParser.urlencoded({extended: true})); //setting up bodyParser

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html"); //When it gets home route ('/'), 'signup.html' is opened.
});

app.post("/",function(req,res){
    const firstName=req.body.fName; //'fName' is name of 1st input.
    const lastName=req.body.lName; //'lName' is name of 2nd input.
    const email=req.body.email; //'email' is name of 3rd input.
    //console.log(firstName,lastName,email)
    
    const data={ //Javascript data
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    
    const jsonData=JSON.stringify(data); //converting Javascript data to JSON data

    const url="https://us8.api.mailchimp.com/3.0/lists/13e316dd3a";

    const options={
        method: "POST",
        auth: "suvam1:f4601d2bf8a6c04156d4126d66d9b8e8-us8"
    }

    const request=https.request(url,options,function(response){
        if(response.statusCode===200){
            //res.send("Successfully subscribed!"); //will be displayed in webside
            res.sendFile(__dirname+"/success.html"); //'success.html' will be opened.
        }else{
            //res.send("There was an error with signing up, please try again!");
            res.sendFile(__dirname+"/failure.html"); //'failure.html' will be opened.
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/") //If 'Try Again' button ('/failure' route) of 'failure.html' is clicked, it will open (redirect to) 'signup.html' (main route ('/')).
})

app.listen(process.env.PORT || 3000,function(){ //'process.env.PORT' - as 'Heroku' may not use port 3000, it may use any port. 'process.env.PORT' is a dynamic port.
    console.log("Server is running on port 3000");
});

//API Key (Mailchimp)
//f4601d2bf8a6c04156d4126d66d9b8e8-us8

//List ID (Audience ID)
//13e316dd3a