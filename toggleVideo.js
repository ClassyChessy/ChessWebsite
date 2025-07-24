function toggleVideo(id) {
    const videoDiv = document.getElementById(id);
    if (!videoDiv) {
        console.error(`Element with id ${id} not found.`);
        return;
    }
    videoDiv.style.display = videoDiv.style.display === "none" ? "block" : "none";
}