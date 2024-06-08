import User from "../model/userModel.js";
import bcrypt from "bcryptjs";

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            return res.json({ msg: "Username already exists.", status: false });
        }

        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.json({ msg: "Email already registered.", status: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        delete user.password;
        return res.json({ status: true, user });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ msg: "Incorrect username or password.", status: false });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ msg: "Incorrect username or password.", status: false });
        }
        delete user.password;
        return res.json({ status: true, user });
    } catch (err) {
        next(err);
    }
};

const setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        });
        return res.json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage });
    } catch (err) {
        next(err);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);
    } catch (err) {
        next(err);
    }
};

const getUserContacts = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const contacts = await User.find({ _id: { $in: user.contacts.map(contact => contact.userId) } })
            .select(["email", "username", "avatarImage", "_id"]);
        return res.json(contacts);
    } catch (err) {
        next(err);
    }
};

const sendRequest = async (req, res, next) => {
    try {
        const senderId = req.params.id;
        const { contactId } = req.body;

        const sender = await User.findById(senderId);
        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }

        const recipient = await User.findById(contactId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        const existingRequest = sender.sentRequests.find(request => request.userId.equals(contactId));
        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        sender.sentRequests.push({ userId: recipient._id, status: 'pending' });
        recipient.receivedRequests.push({ userId: sender._id, status: 'pending' });

        await sender.save();
        await recipient.save();

        return res.json({ message: "Friend request sent successfully" });
    } catch (err) {
        next(err);
    }
};

const getSentRequests = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const sender = await User.findById(userId);
        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }
        const requests = await User.find({ _id: { $in: sender.sentRequests.map(contact => contact.userId) } })
            .select(["_id"]);
        return res.json(requests);
    } catch (err) {
        next(err);
    }
};

const getRecievedRequests = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const requests = await User.find({ _id: { $in: user.receivedRequests.map(contact => contact.userId) } })
            .select(["email", "username", "avatarImage", "_id"]);
        return res.json(requests);
    } catch (err) {
        next(err);
    }
};

const acceptRequest = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { contactId } = req.body;

        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const friendRequestUser = await User.findById(contactId);
        if (!friendRequestUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Add to contacts
        currentUser.contacts.push({ userId: friendRequestUser._id });
        friendRequestUser.contacts.push({ userId: currentUser._id });

        // Remove from receivedRequests and sentRequests
        currentUser.receivedRequests = currentUser.receivedRequests.filter(request => !request.userId.equals(contactId));
        friendRequestUser.sentRequests = friendRequestUser.sentRequests.filter(request => !request.userId.equals(userId));

        await currentUser.save();
        await friendRequestUser.save();

        return res.json({ message: "Friend request accepted" });
    } catch (err) {
        next(err);
    }
};

const rejectRequest = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { contactId } = req.body;

        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const friendRequestUser = await User.findById(contactId);
        if (!friendRequestUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove from receivedRequests and sentRequests
        currentUser.receivedRequests = currentUser.receivedRequests.filter(request => !request.userId.equals(contactId));
        friendRequestUser.sentRequests = friendRequestUser.sentRequests.filter(request => !request.userId.equals(userId));

        await currentUser.save();
        await friendRequestUser.save();

        return res.json({ message: "Friend request rejected" });
    } catch (err) {
        next(err);
    }
};

export {
    getAllUsers,
    setAvatar,
    register,
    login,
    getUserContacts,
    sendRequest,
    getSentRequests,
    getRecievedRequests,
    acceptRequest,
    rejectRequest
};
