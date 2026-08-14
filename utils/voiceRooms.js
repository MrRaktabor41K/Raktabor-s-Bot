const voiceOwners = new Map();

function setOwner(channelId, userId) {
    voiceOwners.set(channelId, userId);
}

function getOwner(channelId) {
    return voiceOwners.get(channelId);
}

function removeOwner(channelId) {
    voiceOwners.delete(channelId);
}

function isOwner(channelId, userId) {
    return voiceOwners.get(channelId) === userId;
}

module.exports = {
    setOwner,
    getOwner,
    removeOwner,
    isOwner
};