const Chat = require("../models/chat");

// GET all chats sorted by latest
exports.getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find();
        res.render("chats/index", { chats });
    } catch (err) {
        res.status(500).send(err);
    }
};

// GET new chat form
exports.getNewChatForm = (req, res) => {
    try {
        res.render("chats/new");
    } catch (err) {
        res.status(500).send(err);
    }
};

// POST create new chat
exports.createChat = async (req, res) => {
    try {
        const newChat = new Chat(req.body);
        await newChat.save();
        res.redirect("/chats");
    } catch (err) {
        res.status(500).send(err);
    }
};

// GET edit chat form
exports.getEditChatForm = async (req, res) => {
    try {
        const { id } = req.params;
        const chat = await Chat.findById(id);
        res.render("chats/edit", { chat });
    } catch (err) {
        res.status(500).send(err);
    }
};

// PUT update chat
exports.updateChat = async (req, res) => {
    try {
        const { id } = req.params;
        await Chat.findByIdAndUpdate(id, req.body, { runValidators: true });
        res.redirect("/chats");
    } catch (err) {
        res.status(500).send(err);
    }
};

// DELETE chat
exports.deleteChat = async (req, res) => {
    try {
        const { id } = req.params;
        await Chat.findByIdAndDelete(id);
        res.redirect("/chats");
    } catch (err) {
        res.status(500).send(err);
    }
};
