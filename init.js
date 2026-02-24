const mongoose = require("mongoose");
const Chat = require("./models/chat");

mongoose.connect("mongodb://127.0.0.1:27017/whatsapp")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const chats = [
    {
        from: "Aarav",
        to: "Diya",
        message: "Hey Diya, are you coming to the meeting?"
    },
    {
        from: "Diya",
        to: "Aarav",
        message: "Yes, I'll be there in 10 minutes."
    },
    {
        from: "Rohan",
        to: "Sneha",
        message: "Can you share the project files?"
    },
    {
        from: "Sneha",
        to: "Rohan",
        message: "Sure, I just emailed them to you."
    },
    {
        from: "Kabir",
        to: "Anaya",
        message: "Let's catch up this weekend!"
    },
    {
        from: "Anaya",
        to: "Kabir",
        message: "Sounds good! Saturday evening?"
    },
    {
        from: "Vikram",
        to: "Meera",
        message: "Did you complete the assignment?"
    },
    {
        from: "Meera",
        to: "Vikram",
        message: "Almost done, just reviewing it."
    }
];

Chat.insertMany(chats)
    .then(() => console.log("Chats Inserted Successfully"))
    .catch(err => console.log(err));