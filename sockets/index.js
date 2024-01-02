const emitSocketEvent = (req, event, payload) => {
    req.app.get("io").emit(event, payload);
};

module.exports = { emitSocketEvent };