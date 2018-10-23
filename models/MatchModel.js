const Schema = require('mongoose').Schema;

const matchSchema = new Schema({
    match_id: Number,
    players: [{ 
        player_id: Number,
        username: String
     }],
    status: { type: String, enum: ["Active", "Pending", "Ended", "Terminated"], default: "Pending" },
    time_start: { type: Date, default: Date.now },
    time_end: { type: Date }
})

module.exports = mongoose.model('Match', matchSchema);