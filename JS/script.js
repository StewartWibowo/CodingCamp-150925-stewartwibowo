document.addEventListener('DOMContentLoaded', function() {

    // --- Elemen-elemen yang dibutuhkan ---
    const modal = document.getElementById('add-task-modal');
    const addTaskButton = document.querySelector('.add-task-btn');
    const closeModalButton = document.getElementById('close-modal-btn');
    const taskForm = document.getElementById('add-task-form');
    const taskList = document.getElementById('task-list');

    // Elemen untuk upload gambar
    const uploadArea = document.getElementById('upload-area');
    const browseBtn = document.getElementById('browse-btn');
    const fileInput = document.getElementById('file-input');
    const imagePreview = document.getElementById('image-preview');
    const uploadInstructions = document.getElementById('upload-instructions');
    let uploadedFile = null; // Variabel untuk menyimpan file yang diupload

    // --- Fungsi Buka/Tutup Modal ---
    function showModal() {
        modal.style.display = 'flex';
    }

    function hideModal() {
        taskForm.reset(); // Reset form setiap kali modal ditutup
        imagePreview.style.display = 'none'; // Sembunyikan preview
        uploadInstructions.style.display = 'flex'; // Tampilkan kembali instruksi upload
        uploadedFile = null; // Kosongkan file
        modal.style.display = 'none';
    }

    addTaskButton.addEventListener('click', e => { e.preventDefault(); showModal(); });
    closeModalButton.addEventListener('click', e => { e.preventDefault(); hideModal(); });
    window.addEventListener('click', e => { if (e.target == modal) hideModal(); });

    // --- Logika Upload Gambar ---

    // 1. Klik tombol "Browse" akan memicu input file yang tersembunyi
    browseBtn.addEventListener('click', () => fileInput.click());

    // 2. Event listener saat file dipilih
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleFile(fileInput.files[0]);
        }
    });

    // 3. Event listener untuk Drag and Drop
    uploadArea.addEventListener('dragover', e => {
        e.preventDefault();
        uploadArea.classList.add('active');
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('active');
    });
    uploadArea.addEventListener('drop', e => {
        e.preventDefault();
        uploadArea.classList.remove('active');
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // Fungsi untuk memproses dan menampilkan preview file
    function handleFile(file) {
        // Validasi tipe file (hanya gambar)
        if (!file.type.startsWith('image/')) {
            alert('File must be an image!');
            return;
        }
        
        uploadedFile = file; // Simpan file untuk digunakan saat submit

        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            uploadInstructions.style.display = 'none';
        }
        reader.readAsDataURL(file);
    }

    // --- FUNGSI UTAMA: Menambahkan Tugas Baru ---
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        const priorityInput = document.querySelector('input[name="priority"]:checked');

        if (!title || !priorityInput) {
            alert('Please fill in at least the Title and Priority.');
            return;
        }
        
        const description = document.getElementById('description').value.trim();
        const priority = priorityInput.value;
        
        // Buat URL untuk gambar jika ada
        const imageUrl = uploadedFile ? URL.createObjectURL(uploadedFile) : null;

        // Buat elemen gambar HANYA jika ada gambar yang diupload
        const imageHTML = imageUrl ? `<img src="${imageUrl}" alt="task image" class="task-img">` : '';

        const taskCardHTML = `
            <div class="task-card">
                <div class="task-content">
                    <span class="task-check"></span>
                    <div class="task-details">
                        <h4>${title}</h4>
                        <p>${description}</p>
                        <div class="task-tags">
                            <span>Priority: <b class="${priority.toLowerCase()}">${priority.charAt(0).toUpperCase() + priority.slice(1)}</b></span>
                            <span>Status: <b class="not-started">Not Started</b></span>
                        </div>
                    </div>
                </div>
                ${imageHTML}
            </div>
        `;

        taskList.insertAdjacentHTML('beforeend', taskCardHTML);
        hideModal(); // Tutup modal setelah berhasil
    });
});