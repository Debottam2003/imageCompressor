const form = document.querySelector('form');
const body = document.querySelector("body");
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = document.getElementById('file');

    if(file.files.length === 0) {
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
            let response = await fetch("http://localhost:3333/compress", {
                method: "POST",
                body: formdata
            });
            if (!response.ok || response.status !== 200) {
                let data = await response.json();
                alert(data.message);
            }
            else {
                let data = await response.json();
                // alert(data.message);
                let downlaod_btn = document.createElement("a");
                downlaod_btn.innerHTML = "Download File";
                downlaod_btn.classList.add("download-btn");
                // href = file path that need to be downloaded
                downlaod_btn.setAttribute("href", `/images/${file.files[0].name}`);
                downlaod_btn.setAttribute("download", `${file.files[0].name}`);

                body.appendChild(downlaod_btn);

                setTimeout(() => {
                    downlaod_btn.remove();
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