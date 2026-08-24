const API_UPLOAD =
    "https://api.legionteknologi.my.id/upload";

const API_DOWNLOADER =
    "https://api.nexray.eu.cc/downloader/aio";

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");

const overlay =
    document.getElementById("overlay");

const pages =
    document.querySelectorAll(".page");

const navItems =
    document.querySelectorAll(".nav-item");

const fileInput =
    document.getElementById("fileInput");

const chooseBtn =
    document.getElementById("chooseBtn");

const dropZone =
    document.getElementById("dropZone");

const fileInfo =
    document.getElementById("fileInfo");

const fileName =
    document.getElementById("fileName");

const fileSize =
    document.getElementById("fileSize");

const removeFile =
    document.getElementById("removeFile");

const uploadBtn =
    document.getElementById("uploadBtn");

const progressContainer =
    document.getElementById("progressContainer");

const progressBar =
    document.getElementById("progressBar");

const progressPercent =
    document.getElementById("progressPercent");

const uploadResult =
    document.getElementById("uploadResult");

const toast =
    document.getElementById("toast");

let selectedFile = null;

let currentCode = "curl";

const codes = {

    curl:
`curl -X POST "https://api.legionteknologi.my.id/upload" \\
-F "file=@gambar.jpg"`,

    node:
`import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const form = new FormData();

form.append(
  "file",
  fs.createReadStream("./gambar.jpg")
);

const response = await axios.post(
  "https://api.legionteknologi.my.id/upload",
  form,
  {
    headers: form.getHeaders()
  }
);

console.log(response.data);`,

    rey:
`import reycloud from "reycloud/api";

const response = await reycloud.upload(
  "./gambar.jpg"
);

console.log(response);`
};


function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1800);
}


function openMenu() {

    sidebar.classList.add("open");

    overlay.classList.add("active");
}


function closeMenu() {

    sidebar.classList.remove("open");

    overlay.classList.remove("active");
}


menuBtn.addEventListener(
    "click",
    () => {

        if (
            sidebar.classList.contains(
                "open"
            )
        ) {
            closeMenu();
        } else {
            openMenu();
        }

    }
);


overlay.addEventListener(
    "click",
    closeMenu
);


navItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            const page =
                item.dataset.page;

            navItems.forEach(
                x =>
                    x.classList.remove(
                        "active"
                    )
            );

            item.classList.add(
                "active"
            );

            pages.forEach(
                p =>
                    p.classList.remove(
                        "active"
                    )
            );

            const target =
                document.getElementById(
                    `page-${page}`
                );

            if (target) {
                target.classList.add(
                    "active"
                );
            }

            closeMenu();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );

});


chooseBtn.addEventListener(
    "click",
    () => fileInput.click()
);


fileInput.addEventListener(
    "change",
    () => {

        if (
            fileInput.files.length
        ) {

            setFile(
                fileInput.files[0]
            );

        }

    }
);


function setFile(file) {

    selectedFile = file;

    fileName.textContent =
        file.name;

    fileSize.textContent =
        formatSize(file.size);

    fileInfo.style.display =
        "flex";

    uploadBtn.disabled =
        false;

    uploadResult.innerHTML = "";

}


function formatSize(bytes) {

    if (
        !Number.isFinite(bytes)
    ) {
        return "0 B";
    }

    const units = [
        "B",
        "KB",
        "MB",
        "GB",
        "TB"
    ];

    let index = 0;

    let size = bytes;

    while (
        size >= 1024 &&
        index <
            units.length - 1
    ) {

        size /= 1024;

        index++;

    }

    return `${size.toFixed(
        index === 0 ? 0 : 2
    )} ${units[index]}`;

}


removeFile.addEventListener(
    "click",
    () => {

        selectedFile = null;

        fileInput.value = "";

        fileInfo.style.display =
            "none";

        uploadBtn.disabled =
            true;

        uploadResult.innerHTML = "";

        progressContainer.style.display =
            "none";

        progressBar.style.width =
            "0%";

    }
);


dropZone.addEventListener(
    "dragover",
    event => {

        event.preventDefault();

        dropZone.classList.add(
            "dragging"
        );

    }
);


dropZone.addEventListener(
    "dragleave",
    () => {

        dropZone.classList.remove(
            "dragging"
        );

    }
);


dropZone.addEventListener(
    "drop",
    event => {

        event.preventDefault();

        dropZone.classList.remove(
            "dragging"
        );

        const file =
            event.dataTransfer.files[0];

        if (file) {
            setFile(file);
        }

    }
);


uploadBtn.addEventListener(
    "click",
    uploadFile
);


function uploadFile() {

    if (!selectedFile) {
        return;
    }

    const formData =
        new FormData();

    formData.append(
        "file",
        selectedFile
    );

    const xhr =
        new XMLHttpRequest();

    progressContainer.style.display =
        "block";

    uploadBtn.disabled =
        true;

    progressBar.style.width =
        "0%";

    progressPercent.textContent =
        "0%";

    uploadResult.innerHTML = "";

    xhr.open(
        "POST",
        API_UPLOAD,
        true
    );

    xhr.upload.addEventListener(
        "progress",
        event => {

            if (
                event.lengthComputable
            ) {

                const percent =
                    Math.round(
                        (
                            event.loaded /
                            event.total
                        ) * 100
                    );

                progressBar.style.width =
                    `${percent}%`;

                progressPercent.textContent =
                    `${percent}%`;

            }

        }
    );

    xhr.onload = () => {

        uploadBtn.disabled =
            false;

        if (
            xhr.status >= 200 &&
            xhr.status < 300
        ) {

            let data;

            try {

                data =
                    JSON.parse(
                        xhr.responseText
                    );

            } catch {

                uploadResult.innerHTML =
                    `<div class="result-box">
                        <strong>Upload berhasil</strong>
                        <pre>${escapeHtml(
                            xhr.responseText
                        )}</pre>
                    </div>`;

                return;
            }

            if (
                data.status &&
                data.result
            ) {

                const url =
                    data.result.url;

                uploadResult.innerHTML =
                    `<div class="result-box">
                        <strong>✓ Upload berhasil</strong>

                        <div class="result-url">
                            <input
                                value="${escapeAttr(url)}"
                                readonly
                                id="resultUrl"
                            >

                            <button
                                class="copy-small"
                                id="copyResult"
                            >
                                Copy
                            </button>
                        </div>
                    </div>`;

                document
                    .getElementById(
                        "copyResult"
                    )
                    .addEventListener(
                        "click",
                        () => {

                            copyText(url);

                        }
                    );

            } else {

                uploadResult.innerHTML =
                    `<div class="result-box">
                        <strong style="color:#ff7070">
                            Upload gagal
                        </strong>

                        <pre>${escapeHtml(
                            JSON.stringify(
                                data,
                                null,
                                2
                            )
                        )}</pre>
                    </div>`;

            }

        } else {

            uploadResult.innerHTML =
                `<div class="result-box">
                    <strong style="color:#ff7070">
                        Upload gagal
                    </strong>

                    <pre>${escapeHtml(
                        xhr.responseText ||
                        "HTTP " +
                        xhr.status
                    )}</pre>
                </div>`;

        }

    };

    xhr.onerror = () => {

        uploadBtn.disabled =
            false;

        uploadResult.innerHTML =
            `<div class="result-box">
                <strong style="color:#ff7070">
                    Connection Error
                </strong>

                <p>
                    Tidak dapat terhubung ke API.
                </p>
            </div>`;

    };

    xhr.send(formData);

}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function escapeAttr(value) {

    return escapeHtml(value);

}


function copyText(text) {

    navigator.clipboard
        .writeText(text)
        .then(() => {

            showToast(
                "Berhasil disalin!"
            );

        })
        .catch(() => {

            showToast(
                "Gagal menyalin"
            );

        });

}


document
    .querySelectorAll(
        "[data-copy]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                copyText(
                    button.dataset.copy
                );

            }
        );

    });


document
    .querySelectorAll(
        ".code-tab"
    )
    .forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".code-tab"
                    )
                    .forEach(
                        x =>
                            x.classList.remove(
                                "active"
                            )
                    );

                tab.classList.add(
                    "active"
                );

                currentCode =
                    tab.dataset.code;

                renderCode();

            }
        );

    });


function renderCode() {

    document
        .getElementById(
            "codeOutput"
        )
        .textContent =
        codes[currentCode];

}


document
    .getElementById(
        "copyCode"
    )
    .addEventListener(
        "click",
        () => {

            copyText(
                codes[currentCode]
            );

        }
    );


renderCode();


document
    .getElementById(
        "apiTestBtn"
    )
    .addEventListener(
        "click",
        testApi
    );


function testApi() {

    const input =
        document.getElementById(
            "apiFile"
        );

    const result =
        document.getElementById(
            "apiResult"
        );

    const loading =
        document.getElementById(
            "apiLoading"
        );

    if (
        !input.files.length
    ) {

        result.textContent =
            JSON.stringify(
                {
                    status: false,
                    message:
                        "Pilih file terlebih dahulu"
                },
                null,
                2
            );

        return;

    }

    const form =
        new FormData();

    form.append(
        "file",
        input.files[0]
    );

    loading.style.display =
        "block";

    result.textContent =
        "Uploading...";

    fetch(
        API_UPLOAD,
        {
            method: "POST",
            body: form
        }
    )
        .then(
            async response => {

                const text =
                    await response.text();

                try {

                    return JSON.parse(
                        text
                    );

                } catch {

                    return {
                        status:
                            false,

                        code:
                            response.status,

                        response:
                            text
                    };

                }

            }
        )
        .then(
            data => {

                result.textContent =
                    JSON.stringify(
                        data,
                        null,
                        2
                    );

            }
        )
        .catch(
            error => {

                result.textContent =
                    JSON.stringify(
                        {
                            status: false,
                            error:
                                error.message
                        },
                        null,
                        2
                    );

            }
        )
        .finally(
            () => {

                loading.style.display =
                    "none";

            }
        );

}


document
    .getElementById(
        "downloadBtn"
    )
    .addEventListener(
        "click",
        downloadMedia
    );


async function downloadMedia() {

    const input =
        document.getElementById(
            "downloadUrl"
        );

    const result =
        document.getElementById(
            "downloadResult"
        );

    const url =
        input.value.trim();

    if (!url) {

        result.innerHTML =
            `<div class="download-card">
                Masukkan URL terlebih dahulu.
            </div>`;

        return;

    }

    result.innerHTML =
        `<div class="download-card">
            Processing...
        </div>`;

    try {

        const apiUrl =
            API_DOWNLOADER +
            "?url=" +
            encodeURIComponent(
                url
            );

        const response =
            await fetch(
                apiUrl
            );

        const data =
            await response.json();

        if (
            !data.status ||
            !data.result
        ) {

            result.innerHTML =
                `<div class="download-card">
                    <pre>${escapeHtml(
                        JSON.stringify(
                            data,
                            null,
                            2
                        )
                    )}</pre>
                </div>`;

            return;

        }

        const item =
            data.result;

        let media = "";

        if (
            item.thumbnail
        ) {

            media +=
                `<img
                    src="${escapeAttr(
                        item.thumbnail
                    )}"
                    alt="Thumbnail"
                >`;

        }

        media +=
            `<h3>
                ${escapeHtml(
                    item.title ||
                    "Media"
                )}
            </h3>

            <p>
                ${escapeHtml(
                    item.author ||
                    item.unique_id ||
                    ""
                )}
            </p>`;

        if (
            Array.isArray(
                item.medias
            )
        ) {

            item.medias.forEach(
                mediaItem => {

                    if (
                        mediaItem.url
                    ) {

                        media +=
                            `<p>
                                <a
                                    href="${escapeAttr(
                                        mediaItem.url
                                    )}"
                                    target="_blank"
                                    style="
                                        color:#60aaff;
                                        text-decoration:none;
                                    "
                                >
                                    Download ${
                                        escapeHtml(
                                            mediaItem.quality ||
                                            mediaItem.type ||
                                            "Media"
                                        )
                                    }
                                </a>
                            </p>`;

                    }

                }
            );

        }

        result.innerHTML =
            `<div class="download-card">
                ${media}
            </div>`;

    } catch (error) {

        result.innerHTML =
            `<div class="download-card">
                <strong style="color:#ff7070">
                    Gagal memproses
                </strong>

                <p>
                    ${escapeHtml(
                        error.message
                    )}
                </p>
            </div>`;

    }

}


const welcome =
    document.getElementById(
        "welcome"
    );

const welcomeClose =
    document.getElementById(
        "welcomeClose"
    );

const welcomeOk =
    document.getElementById(
        "welcomeOk"
    );


function closeWelcome() {

    welcome.classList.add(
        "hidden"
    );

    localStorage.setItem(
        "reycloud_welcome",
        "1"
    );

}


welcomeClose.addEventListener(
    "click",
    closeWelcome
);


welcomeOk.addEventListener(
    "click",
    closeWelcome
);


if (
    localStorage.getItem(
        "reycloud_welcome"
    )
) {

    welcome.classList.add(
        "hidden"
    );

}
