import Conversation from "../modals/conversationModal.js"
import Message from "../modals/messageModal.js"
import User from "../modals/userModel.js"

const getMessages = async(req, res) => {
    try {
        const conversationId = req.params.id
        const conversations = await Message.find({ conversationId })
        res.status(200).json(conversations)
        
    } catch (error) {
        res.status(500).json({ error: error.message})   
    }
}

const sendMessage = async(req, res) => {
    try {
        const { recepientId, message } = req.body
        const senderId = req.user._id

        const recepient = await User.findOne({ _id: recepientId})

        if (!recepient) {
            return res.status(404).json({ error: "User not found" })
        }
        
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recepientId]}
        })

        if(!conversation) {
            conversation = new Conversation({
                participants: [senderId, recepientId],
                lastMessage: {
                    text: message,
                    senderId: senderId
                }
            })
            await conversation.save()
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message
        })

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage: {
                    text: message,
                    sender: senderId
                }
            })
        ])

        res.status(201).json(newMessage)

    } catch (error) {
        res.status(500).json({ error: error.message})       
    }
}

const getConversations = async(req, res) => {
    try {
        const userId = req.user._id 

        const conversations = await Conversation.find({ participants: userId }).populate({
            path: "participants",
            select: "username profilePic"
        })
        res.status(200).json(conversations)
        
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}

export { getMessages, sendMessage, getConversations }