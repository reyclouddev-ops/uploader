const API_UPLOAD =
    "https://api.reycode/upload";

const API_DOWNLOADER =
    "https://api.nexray.eu.cc/downloader/aio";

const MAX_FILE_SIZE =
    1024 * 1024 * 1024;

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

const fileIcon =
    document.getElementById("fileIcon");

const fileName =
    document.getElementById("fileName");

const fileSize =
    document.getElementById("fileSize");

const fileType =
    document.getElementById("fileType");

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

const progressStatus =
    document.getElementById("progressStatus");

const progressInfo =
    document.getElementById("progressInfo");

const uploadResult =
    document.getElementById("uploadResult");

const filePreview =
    document.getElementById("filePreview");

const imagePreview =
    document.getElementById("imagePreview");

const videoPreview =
    document.getElementById("videoPreview");

const audioPreview =
    document.getElementById("audioPreview");

const toast =
    document.getElementById("toast");

let selectedFile = null;
let currentCode = "curl";
let uploadXHR = null;
let toastTimer = null;
let previewUrl = null;

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


/* ============================================================
   TOAST
============================================================ */

function showToast(message) {

    if (!toast) {
        return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 1800);

}


/* ============================================================
   MENU
============================================================ */

function openMenu() {

    sidebar?.classList.add("open");

    overlay?.classList.add("active");

}


function closeMenu() {

    sidebar?.classList.remove("open");

    overlay?.classList.remove("active");

}


menuBtn?.addEventListener(
    "click",
    () => {

        if (
            sidebar?.classList.contains("open")
        ) {

            closeMenu();

        } else {

            openMenu();

        }

    }
);


overlay?.addEventListener(
    "click",
    closeMenu
);


/* ============================================================
   NAVIGATION
============================================================ */

navItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            const page =
                item.dataset.page;

            navItems.forEach(x => {

                x.classList.remove(
                    "active"
                );

            });

            item.classList.add(
                "active"
            );

            pages.forEach(pageItem => {

                pageItem.classList.remove(
                    "active"
                );

            });

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


/* ============================================================
   FILE INPUT
============================================================ */

chooseBtn?.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        if (!uploadXHR) {

            fileInput?.click();

        }

    }
);


dropZone?.addEventListener(
    "click",
    event => {

        if (
            event.target.closest(
                "#chooseBtn"
            )
        ) {
            return;
        }

        if (
            !selectedFile &&
            !uploadXHR
        ) {

            fileInput?.click();

        }

    }
);


fileInput?.addEventListener(
    "change",
    () => {

        if (
            fileInput.files &&
            fileInput.files.length
        ) {

            setFile(
                fileInput.files[0]
            );

        }

    }
);


/* ============================================================
   SET FILE
============================================================ */

function setFile(file) {

    if (!file) {
        return;
    }

    if (
        file.size >
        MAX_FILE_SIZE
    ) {

        showToast(
            "File maksimal 1GB"
        );

        if (fileInput) {
            fileInput.value = "";
        }

        return;

    }

    selectedFile = file;

    if (fileName) {

        fileName.textContent =
            file.name;

    }

    if (fileSize) {

        fileSize.textContent =
            formatSize(file.size);

    }

    if (fileType) {

        fileType.textContent =
            file.type ||
            "application/octet-stream";

    }

    if (fileIcon) {

        fileIcon.textContent =
            getFileIcon(file.type);

    }

    if (fileInfo) {

        fileInfo.style.display =
            "flex";

    }

    if (uploadBtn) {

        uploadBtn.disabled =
            false;

    }

    if (uploadResult) {

        uploadResult.innerHTML =
            "";

    }

    if (progressContainer) {

        progressContainer.style.display =
            "none";

    }

    resetProgress();

    resetPreview();

    createPreview(file);

}


/* ============================================================
   FILE ICON
============================================================ */

function getFileIcon(type = "") {

    if (
        type.startsWith("image/")
    ) {
        return "IMG";
    }

    if (
        type.startsWith("video/")
    ) {
        return "VIDEO";
    }

    if (
        type.startsWith("audio/")
    ) {
        return "AUDIO";
    }

    if (
        type.includes("pdf")
    ) {
        return "PDF";
    }

    if (
        type.includes("zip") ||
        type.includes("rar")
    ) {
        return "ZIP";
    }

    if (
        type.includes("text")
    ) {
        return "TXT";
    }

    return "FILE";

}


/* ============================================================
   PREVIEW
============================================================ */

function createPreview(file) {

    if (!filePreview) {
        return;
    }

    resetPreview();

    previewUrl =
        URL.createObjectURL(file);

    if (
        file.type.startsWith("image/")
    ) {

        if (imagePreview) {

            imagePreview.src =
                previewUrl;

            imagePreview.style.display =
                "block";

        }

        filePreview.style.display =
            "block";

        return;

    }


    if (
        file.type.startsWith("video/")
    ) {

        if (videoPreview) {

            videoPreview.src =
                previewUrl;

            videoPreview.style.display =
                "block";

        }

        filePreview.style.display =
            "block";

        return;

    }


    if (
        file.type.startsWith("audio/")
    ) {

        if (audioPreview) {

            audioPreview.src =
                previewUrl;

            audioPreview.style.display =
                "block";

        }

        filePreview.style.display =
            "block";

    }

}


function resetPreview() {

    if (previewUrl) {

        try {

            URL.revokeObjectURL(
                previewUrl
            );

        } catch {}

        previewUrl = null;

    }

    if (!filePreview) {
        return;
    }

    if (imagePreview) {

        imagePreview.style.display =
            "none";

        imagePreview.removeAttribute(
            "src"
        );

    }

    if (videoPreview) {

        videoPreview.pause?.();

        videoPreview.style.display =
            "none";

        videoPreview.removeAttribute(
            "src"
        );

        videoPreview.load?.();

    }

    if (audioPreview) {

        audioPreview.pause?.();

        audioPreview.style.display =
            "none";

        audioPreview.removeAttribute(
            "src"
        );

        audioPreview.load?.();

    }

    filePreview.style.display =
        "none";

}


/* ============================================================
   FORMAT SIZE
============================================================ */

function formatSize(bytes) {

    if (
        !Number.isFinite(bytes) ||
        bytes <= 0
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


/* ============================================================
   RESET PROGRESS
============================================================ */

function resetProgress() {

    if (progressBar) {

        progressBar.style.width =
            "0%";

    }

    if (progressPercent) {

        progressPercent.textContent =
            "0%";

    }

    if (progressStatus) {

        progressStatus.textContent =
            "Uploading...";

    }

    if (progressInfo) {

        progressInfo.textContent =
            "Menyiapkan upload...";

    }

}


/* ============================================================
   REMOVE FILE
============================================================ */

removeFile?.addEventListener(
    "click",
    () => {

        if (uploadXHR) {

            try {
                uploadXHR.abort();
            } catch {}

            uploadXHR = null;

        }

        selectedFile = null;

        if (fileInput) {

            fileInput.value =
                "";

        }

        if (fileInfo) {

            fileInfo.style.display =
                "none";

        }

        if (uploadBtn) {

            uploadBtn.disabled =
                true;

        }

        if (uploadResult) {

            uploadResult.innerHTML =
                "";

        }

        if (progressContainer) {

            progressContainer.style.display =
                "none";

        }

        resetProgress();

        resetPreview();

    }
);


/* ============================================================
   DRAG & DROP
============================================================ */

dropZone?.addEventListener(
    "dragover",
    event => {

        event.preventDefault();

        if (!uploadXHR) {

            dropZone.classList.add(
                "dragging"
            );

        }

    }
);


dropZone?.addEventListener(
    "dragleave",
    event => {

        event.preventDefault();

        dropZone.classList.remove(
            "dragging"
        );

    }
);


dropZone?.addEventListener(
    "drop",
    event => {

        event.preventDefault();

        dropZone.classList.remove(
            "dragging"
        );

        if (uploadXHR) {
            return;
        }

        const file =
            event.dataTransfer?.files?.[0];

        if (file) {

            setFile(file);

        }

    }
);


/* ============================================================
   UPLOAD
============================================================ */

uploadBtn?.addEventListener(
    "click",
    uploadFile
);


function uploadFile() {

    if (
        !selectedFile ||
        uploadXHR
    ) {
        return;
    }

    if (
        selectedFile.size >
        MAX_FILE_SIZE
    ) {

        showToast(
            "File maksimal 1GB"
        );

        return;

    }

    const formData =
        new FormData();

    formData.append(
        "file",
        selectedFile,
        selectedFile.name
    );

    const xhr =
        new XMLHttpRequest();

    uploadXHR = xhr;

    if (progressContainer) {

        progressContainer.style.display =
            "block";

    }

    if (uploadBtn) {

        uploadBtn.disabled =
            true;

    }

    resetProgress();

    if (progressStatus) {

        progressStatus.textContent =
            "Uploading...";

    }

    if (progressInfo) {

        progressInfo.textContent =
            `Mengirim ${formatSize(
                selectedFile.size
            )} ke ReyCloud CDN...`;

    }

    if (uploadResult) {

        uploadResult.innerHTML =
            "";

    }

    xhr.open(
        "POST",
        API_UPLOAD,
        true
    );

    xhr.timeout =
        180000;


    /* --------------------------------------------------------
       UPLOAD PROGRESS
    -------------------------------------------------------- */

    xhr.upload.addEventListener(
        "loadstart",
        () => {

            if (progressStatus) {

                progressStatus.textContent =
                    "Uploading...";

            }

        }
    );


    xhr.upload.addEventListener(
        "progress",
        event => {

            if (
                !event.lengthComputable
            ) {
                return;
            }

            const percent =
                Math.min(
                    100,
                    Math.round(
                        (
                            event.loaded /
                            event.total
                        ) * 100
                    )
                );

            if (progressBar) {

                progressBar.style.width =
                    `${percent}%`;

            }

            if (progressPercent) {

                progressPercent.textContent =
                    `${percent}%`;

            }

            if (progressInfo) {

                progressInfo.textContent =
                    `${formatSize(
                        event.loaded
                    )} / ${formatSize(
                        event.total
                    )}`;

            }

        }
    );


    xhr.upload.addEventListener(
        "load",
        () => {

            if (progressStatus) {

                progressStatus.textContent =
                    "Memproses response...";

            }

            if (progressInfo) {

                progressInfo.textContent =
                    "File sudah terkirim, menunggu server...";

            }

        }
    );


    /* --------------------------------------------------------
       RESPONSE
    -------------------------------------------------------- */

    xhr.onload = () => {

        uploadXHR = null;

        if (uploadBtn) {

            uploadBtn.disabled =
                false;

        }

        const responseText =
            (
                xhr.responseText ||
                ""
            ).trim();


        if (
            xhr.status >= 200 &&
            xhr.status < 300
        ) {

            let data = null;

            try {

                data =
                    JSON.parse(
                        responseText
                    );

            } catch {

                data = null;

            }


            /* JSON RESPONSE */

            if (
                data &&
                data.status &&
                data.result
            ) {

                showUploadSuccess(
                    data.result
                );

                return;

            }


            /* PLAIN URL RESPONSE */

            if (
                responseText &&
                /^https?:\/\//i.test(
                    responseText
                )
            ) {

                showUploadSuccess({

                    url:
                        responseText,

                    filename:
                        selectedFile?.name ||
                        "uploaded-file",

                    originalName:
                        selectedFile?.name ||
                        "uploaded-file",

                    size:
                        selectedFile?.size ||
                        0,

                    mimetype:
                        selectedFile?.type ||
                        "application/octet-stream",

                    type:
                        getFileType(
                            selectedFile?.type ||
                            ""
                        )

                });

                return;

            }


            showUploadError(
                "Server berhasil merespons, tetapi format response tidak dikenali."
            );

            return;

        }


        /* ----------------------------------------------------
           HTTP ERROR
        ---------------------------------------------------- */

        let errorMessage =
            responseText ||
            `HTTP ${xhr.status}`;

        try {

            const errorData =
                JSON.parse(
                    responseText
                );

            errorMessage =
                errorData.message ||
                errorData.error ||
                errorMessage;

        } catch {}


        showUploadError(
            errorMessage
        );

    };


    /* --------------------------------------------------------
       NETWORK / CORS ERROR
    -------------------------------------------------------- */

    xhr.onerror = () => {

        uploadXHR = null;

        if (uploadBtn) {

            uploadBtn.disabled =
                false;

        }

        let message =
            "Tidak dapat terhubung ke API.";

        if (
            xhr.status === 0
        ) {

            message =
                "Koneksi API gagal atau response diblokir browser. Periksa CORS, domain API, atau koneksi server.";

        }

        showUploadError(
            message
        );

    };


    /* --------------------------------------------------------
       TIMEOUT
    -------------------------------------------------------- */

    xhr.ontimeout = () => {

        uploadXHR = null;

        if (uploadBtn) {

            uploadBtn.disabled =
                false;

        }

        showUploadError(
            "Upload timeout setelah 180 detik. Coba lagi atau periksa koneksi server."
        );

    };


    /* --------------------------------------------------------
       ABORT
    -------------------------------------------------------- */

    xhr.onabort = () => {

        uploadXHR = null;

        if (uploadBtn) {

            uploadBtn.disabled =
                false;

        }

        if (progressStatus) {

            progressStatus.textContent =
                "Upload dibatalkan";

        }

        if (progressInfo) {

            progressInfo.textContent =
                "Upload dihentikan.";

        }

    };


    try {

        xhr.send(
            formData
        );

    } catch (error) {

        uploadXHR = null;

        if (uploadBtn) {

            uploadBtn.disabled =
                false;

        }

        showUploadError(
            error.message ||
            "Gagal mengirim file."
        );

    }

}


/* ============================================================
   UPLOAD SUCCESS
============================================================ */

function showUploadSuccess(
    result
) {

    if (progressBar) {

        progressBar.style.width =
            "100%";

    }

    if (progressPercent) {

        progressPercent.textContent =
            "100%";

    }

    if (progressStatus) {

        progressStatus.textContent =
            "Upload selesai";

    }

    if (progressInfo) {

        progressInfo.textContent =
            "File berhasil diupload.";

    }


    const url =
        result?.url ||
        "";

    const name =
        result?.filename ||
        result?.originalName ||
        selectedFile?.name ||
        "-";

    const size =
        Number(
            result?.size
        ) ||
        selectedFile?.size ||
        0;

    const mime =
        result?.mimetype ||
        selectedFile?.type ||
        "application/octet-stream";

    const type =
        result?.type ||
        getFileType(mime);


    if (!url) {

        if (uploadResult) {

            uploadResult.innerHTML =
`<div class="result-box">

    <strong>
        ✓ Upload berhasil
    </strong>

    <pre>${escapeHtml(
        result?.raw ||
        "Server tidak mengembalikan URL."
    )}</pre>

</div>`;

        }

        return;

    }


    if (uploadResult) {

        uploadResult.innerHTML =
`<div class="result-box">

    <strong>
        ✓ Upload berhasil
    </strong>

    <div class="result-meta">

        <div>
            <span>File</span>
            <b>${escapeHtml(name)}</b>
        </div>

        <div>
            <span>Ukuran</span>
            <b>${formatSize(size)}</b>
        </div>

        <div>
            <span>MIME</span>
            <b>${escapeHtml(mime)}</b>
        </div>

        <div>
            <span>Tipe</span>
            <b>${escapeHtml(type)}</b>
        </div>

    </div>

    <div class="result-url">

        <input
            value="${escapeAttr(url)}"
            readonly
            id="resultUrl"
        >

        <button
            class="copy-small"
            id="copyResult"
            type="button"
        >
            📋 Copy
        </button>

    </div>

    <div class="result-actions">

        <button
            class="primary-btn"
            id="copyResultButton"
            type="button"
        >
            📋 Salin URL
        </button>

        <a
            class="primary-btn"
            id="openResultButton"
            href="${escapeAttr(url)}"
            target="_blank"
            rel="noopener noreferrer"
        >
            🌐 Buka Link
        </a>

    </div>

</div>`;

    }


    document
        .getElementById(
            "copyResult"
        )
        ?.addEventListener(
            "click",
            () => {

                copyText(url);

            }
        );


    document
        .getElementById(
            "copyResultButton"
        )
        ?.addEventListener(
            "click",
            () => {

                copyText(url);

            }
        );


    if (progressContainer) {

        progressContainer.style.display =
            "block";

    }

}


/* ============================================================
   UPLOAD ERROR
============================================================ */

function showUploadError(
    message
) {

    if (progressStatus) {

        progressStatus.textContent =
            "Upload gagal";

    }

    if (progressInfo) {

        progressInfo.textContent =
            "Terjadi kesalahan saat upload.";

    }

    if (uploadResult) {

        uploadResult.innerHTML =
`<div class="result-box">

    <strong style="color:#ff7070">
        ✕ Upload gagal
    </strong>

    <p>
        ${escapeHtml(
            message
        )}
    </p>

    <button
        class="primary-btn"
        id="retryUpload"
        type="button"
    >
        ↻ Coba Lagi
    </button>

</div>`;

    }


    document
        .getElementById(
            "retryUpload"
        )
        ?.addEventListener(
            "click",
            uploadFile
        );

}


/* ============================================================
   FILE TYPE
============================================================ */

function getFileType(
    mime = ""
) {

    if (
        mime.startsWith("image/")
    ) {
        return "image";
    }

    if (
        mime.startsWith("video/")
    ) {
        return "video";
    }

    if (
        mime.startsWith("audio/")
    ) {
        return "music";
    }

    if (
        mime.includes("pdf")
    ) {
        return "pdf";
    }

    if (
        mime.includes("zip") ||
        mime.includes("rar")
    ) {
        return "archive";
    }

    return "file";

}


/* ============================================================
   ESCAPE HTML
============================================================ */

function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


function escapeAttr(value) {

    return escapeHtml(value);

}


/* ============================================================
   COPY
============================================================ */

async function copyText(text) {

    if (!text) {

        showToast(
            "URL tidak tersedia"
        );

        return;

    }


    try {

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(
                text
            );

            showToast(
                "Berhasil disalin!"
            );

            return;

        }


        const textarea =
            document.createElement(
                "textarea"
            );

        textarea.value =
            text;

        textarea.style.position =
            "fixed";

        textarea.style.left =
            "-9999px";

        textarea.style.top =
            "0";

        textarea.style.opacity =
            "0";

        document.body.appendChild(
            textarea
        );

        textarea.focus();

        textarea.select();

        textarea.setSelectionRange(
            0,
            textarea.value.length
        );

        const success =
            document.execCommand(
                "copy"
            );

        textarea.remove();

        if (success) {

            showToast(
                "Berhasil disalin!"
            );

        } else {

            showToast(
                "Gagal menyalin URL"
            );

        }

    } catch {

        showToast(
            "Gagal menyalin URL"
        );

    }

}


/* ============================================================
   DATA COPY
============================================================ */

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


/* ============================================================
   CODE TABS
============================================================ */

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
                    .forEach(x => {

                        x.classList.remove(
                            "active"
                        );

                    });


                tab.classList.add(
                    "active"
                );


                currentCode =
                    tab.dataset.code ||
                    "curl";


                renderCode();

            }
        );

    });


function renderCode() {

    const output =
        document.getElementById(
            "codeOutput"
        );

    if (!output) {
        return;
    }

    output.textContent =
        codes[currentCode] ||
        "";

}


document
    .getElementById(
        "copyCode"
    )
    ?.addEventListener(
        "click",
        () => {

            copyText(
                codes[currentCode]
            );

        }
    );


renderCode();


/* ============================================================
   API TESTER
============================================================ */

document
    .getElementById(
        "apiTestBtn"
    )
    ?.addEventListener(
        "click",
        testApi
    );


async function testApi() {

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
        !input ||
        !input.files ||
        !input.files.length
    ) {

        if (result) {

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

        }

        return;

    }


    const file =
        input.files[0];


    if (
        file.size >
        MAX_FILE_SIZE
    ) {

        if (result) {

            result.textContent =
                JSON.stringify(
                    {
                        status: false,
                        message:
                            "File maksimal 1GB"
                    },
                    null,
                    2
                );

        }

        return;

    }


    const form =
        new FormData();

    form.append(
        "file",
        file,
        file.name
    );


    if (loading) {

        loading.style.display =
            "block";

    }

    if (result) {

        result.textContent =
            "Uploading...";

    }


    try {

        const response =
            await fetch(
                API_UPLOAD +
                "?reqtype=fileupload",
                {
                    method: "POST",
                    body: form
                }
            );


        const text =
            (
                await response.text()
            ).trim();


        let data;


        try {

            data =
                JSON.parse(text);

        } catch {

            if (
                response.ok &&
                /^https?:\/\//i.test(
                    text
                )
            ) {

                data = {

                    status: true,

                    result: {
                        url: text
                    }

                };

            } else {

                data = {

                    status: false,

                    code:
                        response.status,

                    response:
                        text

                };

            }

        }


        if (result) {

            result.textContent =
                JSON.stringify(
                    data,
                    null,
                    2
                );

        }

    } catch (error) {

        if (result) {

            result.textContent =
                JSON.stringify(
                    {
                        status: false,
                        error:
                            error.message ||
                            "Tidak dapat terhubung ke API."
                    },
                    null,
                    2
                );

        }

    } finally {

        if (loading) {

            loading.style.display =
                "none";

        }

    }

}


/* ============================================================
   DOWNLOADER
============================================================ */

document
    .getElementById(
        "downloadBtn"
    )
    ?.addEventListener(
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

    const loading =
        document.getElementById(
            "downloadLoading"
        );

    if (!input || !result) {
        return;
    }


    const url =
        input.value.trim();


    if (!url) {

        result.innerHTML =
`<div class="download-card">
    Masukkan URL terlebih dahulu.
</div>`;

        return;

    }


    if (loading) {

        loading.style.display =
            "block";

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


        const text =
            await response.text();


        let data;


        try {

            data =
                JSON.parse(
                    text
                );

        } catch {

            throw new Error(
                "Response downloader bukan JSON."
            );

        }


        if (
            !response.ok
        ) {

            throw new Error(
                data.message ||
                data.error ||
                `HTTP ${response.status}`
            );

        }


        if (
            !data.status ||
            !data.result
        ) {

            result.innerHTML =
`<div class="download-card">

    <strong style="color:#ff7070">
        Gagal memproses
    </strong>

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
    loading="lazy"
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
                        mediaItem &&
                        mediaItem.url
                    ) {

                        media +=
`<p>

    <a
        href="${escapeAttr(
            mediaItem.url
        )}"
        target="_blank"
        rel="noopener noreferrer"
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
            error.message ||
            "Terjadi kesalahan."
        )}
    </p>

</div>`;

    } finally {

        if (loading) {

            loading.style.display =
                "none";

        }

    }

}


/* ============================================================
   WELCOME MODAL
============================================================ */

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

    if (!welcome) {
        return;
    }

    welcome.classList.add(
        "hidden"
    );

    try {

        localStorage.setItem(
            "reycloud_welcome",
            "1"
        );

    } catch {}

}


welcomeClose?.addEventListener(
    "click",
    closeWelcome
);


welcomeOk?.addEventListener(
    "click",
    closeWelcome
);


try {

    if (
        localStorage.getItem(
            "reycloud_welcome"
        )
    ) {

        welcome?.classList.add(
            "hidden"
        );

    }

} catch {}