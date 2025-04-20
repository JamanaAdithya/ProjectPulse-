// A re-usable function to calculate duration between two timestamps
function calculateDuration(startTime, endTime) {
    if(!startTime || !endTime) return 0;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;

    return Math.floor(diffMs/60000);
}

module.exports = calculateDuration; 