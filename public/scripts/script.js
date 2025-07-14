const form = document.querySelector('form');
const body = document.querySelector("body");
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = document.getElementById('file');

    if (file.files.length === 0) {
        window.alert("Choose a File");
        return;
    }

    console.log(file.files[0].size);
    // 50 mb limit
    if (file.files[0].size > 50000000) {
        window.alert("File Size is too large");
        return;
    }

    else {
        const formdata = new FormData();
        formdata.append('file', file.files[0]);
        console.log(formdata);
        try {
            document.getElementById("compress").textContent = "Doing...";
            let response = await fetch("https://imagecompressor-8z4u.onrender.com/compress", {
                method: "POST",
                body: formdata
            });
            if (!response.ok || response.status !== 200) {
                let data = await response.json();
                alert(data.message);
            }
            else {
                let data = await response.json();
                document.getElementById("compress").textContent = "Compress";

                let downloadBtn = document.createElement("a");
                downloadBtn.innerHTML = "Download File";
                downloadBtn.classList.add("download-btn");

                // ⬇️ Corrected URL using server's filename from response
                downloadBtn.setAttribute("href", `https://imagecompressor-8z4u.onrender.com/download/${data.filename}`);
                downloadBtn.setAttribute("download", `${data.filename}`);

                body.appendChild(downloadBtn);

                setTimeout(() => {
                    downloadBtn.remove();
                }, 15000);

                form.reset();
            }
        }
        catch (err) {
            console.log(err);
            alert(err.message);
        }
    }
});