const Chat = require("../models/chat");

// Helper function to format relative time
const getRelativeTime = (createdAt) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - createdAt) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} secs ago`;
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
};

// GET all chats sorted by latest
exports.getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find().sort({ created_at: -1 });
        const chatsWithTime = chats.map(chat => ({
            ...chat.toObject(),
            relativeTime: getRelativeTime(chat.created_at)
        }));
        res.render("chats/index", { chats: chatsWithTime });
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
        const updateData = {
            ...req.body,
            isEdited: true
        };
        await Chat.findByIdAndUpdate(id, updateData, { runValidators: true });
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
        console.error("Error deleting chat:", err);
        res.status(500).send(err);
    }
};

// PATCH mark chat as seen
exports.markAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Chat.findByIdAndUpdate(id, { seen: true }, { runValidators: true });
        res.redirect("/chats");
    } catch (err) {
        res.status(500).send(err);
    }
};
