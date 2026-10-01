const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
    {
        empId: {
            type: String,
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        reason: {
            type: String,
            required: true
        },

        grant: {
            type: String,
            enum: ["Yes", "No"],
            default: "No"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Leave", leaveSchema);