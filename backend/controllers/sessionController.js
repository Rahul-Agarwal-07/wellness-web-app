const Session = require("../models/Session");
const mongoose = require('mongoose')
// GET /api/sessions
exports.getPublicSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ isPublic: true }); // Only public ones
    return res.status(200).json(sessions);
  } catch (e) {
    console.error("Error fetching public sessions:", e.message);
    return res.status(500).json({ message: e.message });
  }
};

// GET /api/my-sessions (requires auth middleware)
exports.getMySessions = async (req, res) => {

  try {

    const email = req.user.email; // Comes from JWT
    const sessions = await Session.find({ email : email });
    return res.status(200).json(sessions);

  } 
  catch (e) {
    console.error("Error fetching user sessions:", e.message);
    return res.status(500).json({ message: e.message });
  }
};

// GET /api/my-sessions/:id
exports.getSessionById = async (req, res) => {
  try {
    const sessionId = req.params.id; //Pass Id in the url
    const userEmail = req.user.email; //Comes from JWT
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" }); //Null Safety
    }

    if(!session.isPublic && session.email !== userEmail) //Authenticity Check
    {
        console.log("Unauthorized Access");
        return res.status(403).json({message : "Unauthorized Access"});
    }

    return res.status(200).json(session);
  } catch (e) {
    console.error("Error fetching session by ID:", e.message);
    return res.status(500).json({ message: e.message });
  }
};

// POST /api/my-sessions/publish
exports.publishSession = async(req,res) =>
{
    try
    {
        const { id } = req.body;
        const userEmail = req.user.email;
        const session = await Session.findOne({ _id : id, email : userEmail});

        if(!session)
        {
            console.error("Session Not Found");
            return res.status(404).json({message : "Session Not Found"});
        }
        
        session.isPublic = true
        await session.save();

        return res.status(200).json({
            message : "Session Published Successfully!"
        });
    }
    catch(e)
    {
        console.error("Error Publishing session :", e.message);
        return res.status(500).json({ message: e.message });
    }
}


//POST /api/my-sessions/save-draft
exports.saveOrUpdateDraft = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { _id, title, tags, jsonFileUrl } = req.body;
    const tagsArray = tags.split(",");

    let session;

    if (_id) {
      // Update existing draft
      session = await Session.findOneAndUpdate(
        { _id, email: userEmail },
        { title, tags : tagsArray, jsonFileUrl, isPublic: false },
        { new: true }
      );

      if (!session) {
        return res.status(404).json({ message: "Draft not found or unauthorized" });
      }
    } else {
      // Create new draft
      session = new Session({
        title,
        tags : tagsArray,
        jsonFileUrl,
        email: userEmail,
        isPublic: false
      });
      await session.save();
    }

    return res.status(200).json({
      message: "Draft saved successfully",
      session
    });
  } catch (e) {
    console.error("Error saving/updating draft:", e.message);
    return res.status(500).json({ message: e.message });
  }
};

//DELETE /api/my-session/:id
exports.deleteSession = async (req, res) => {
  try {
    const userEmail = req.user.email; // from JWT
    const { id } = req.params;        // session ID from URL

    // Check if ID is valid Mongo ObjectId
    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    // Delete session only if it belongs to the current user
    const result = await Session.deleteOne({ _id: id, email: userEmail });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Session not found or not owned by you" });
    }

    return res.status(200).json({ message: "Session deleted successfully!" });
  } catch (e) {
    console.error("Error deleting session:", e.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
