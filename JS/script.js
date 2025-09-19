document.addEventListener('DOMContentLoaded', function() {

    // --- Elemen-elemen Global ---
    const modal = document.getElementById('add-task-modal');
    const taskForm = document.getElementById('add-task-form');
    const taskList = document.getElementById('task-list');
    const taskFilter = document.getElementById('task-filter');
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    let taskToDelete = null; 

    // --- Fungsi Buka/Tutup Modal ---
    function setupModalControls() {
        const addTaskButton = document.querySelector('.add-task-btn');
        const closeModalButton = document.getElementById('close-modal-btn');
        const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
        const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

        addTaskButton.addEventListener('click', e => { e.preventDefault(); modal.style.display = 'flex'; });
        closeModalButton.addEventListener('click', e => { e.preventDefault(); hideAndResetModal(); });
        window.addEventListener('click', e => {
            if (e.target == modal) hideAndResetModal();
            if (e.target == deleteConfirmModal) deleteConfirmModal.style.display = 'none';
        });
        cancelDeleteBtn.addEventListener('click', () => deleteConfirmModal.style.display = 'none');
        confirmDeleteBtn.addEventListener('click', () => {
            if (taskToDelete) {
                taskToDelete.remove();
                deleteConfirmModal.style.display = 'none';
                taskToDelete = null;
            }
        });
    }

    function hideAndResetModal() {
        taskForm.reset();
        document.getElementById('image-preview').style.display = 'none';
        document.getElementById('upload-instructions').style.display = 'flex';
        document.getElementById('file-input').value = '';
        modal.style.display = 'none';
    }

    // --- Logika Upload Gambar ---
    function setupImageUpload() {
        const uploadArea = document.getElementById('upload-area');
        const browseBtn = document.getElementById('browse-btn');
        const fileInput = document.getElementById('file-input');
        
        browseBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) handleFile(fileInput.files[0]);
        });
        uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('active'); });
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('active'));
        uploadArea.addEventListener('drop', e => {
            e.preventDefault();
            uploadArea.classList.remove('active');
            if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
        });
    }
    
    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('File must be an image!'); return;
        }
        const reader = new FileReader();
        reader.onload = e => {
            document.getElementById('image-preview').src = e.target.result;
            document.getElementById('image-preview').style.display = 'block';
            document.getElementById('upload-instructions').style.display = 'none';
        }
        reader.readAsDataURL(file);
    }
    
    // --- Logika Form Submit ---
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        const dateInput = document.getElementById('date').value;
        const priorityInput = document.querySelector('input[name="priority"]:checked');

        if (!title || !priorityInput) {
            alert('Please fill in at least the Title and Priority.');
            return;
        }

        const description = document.getElementById('description').value.trim();
        const priority = priorityInput.value;
        const status = 'not-started';
        
        const createdDate = dateInput ? new Date(dateInput).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');

        const file = document.getElementById('file-input').files[0];
        const imageUrl = file ? URL.createObjectURL(file) : null;
        const imageHTML = imageUrl ? `<img src="${imageUrl}" alt="task image" class="task-img">` : '';

        const newCard = document.createElement('div');
        newCard.className = 'task-card';
        newCard.dataset.status = status;
        newCard.innerHTML = `
            <div class="task-content-wrapper">
                <span class="task-check status-${status}"></span>
                <div class="task-details">
                    <h4>${title}</h4>
                    <p>${description}</p>
                    <div class="task-tags">
                        <span>Priority: <b class="${priority.toLowerCase()}">${priority.charAt(0).toUpperCase() + priority.slice(1)}</b></span>
                        <span>Status: <b class="status-text ${status}">${status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</b></span>
                        <span class="created-on">Created on: ${createdDate}</span>
                    </div>
                </div>
                ${imageHTML}
            </div>
            <div class="task-actions">
                <button class="action-btn">•••</button>
                <div class="action-menu">
                    <div class="menu-item status-menu">
                        <span>Task Status</span>
                        <div class="status-submenu">
                            <a href="#" class="status-option" data-new-status="completed">Completed</a>
                            <a href="#" class="status-option" data-new-status="in-progress">In Progress</a>
                            <a href="#" class="status-option" data-new-status="not-started">Not Started</a>
                        </div>
                    </div>
                    <a href="#" class="menu-item delete-menu-btn">Delete</a>
                </div>
            </div>
        `;
        taskList.appendChild(newCard);
        hideAndResetModal();
    });

    // --- Event Delegation untuk Aksi pada Kartu Tugas ---
    taskList.addEventListener('click', function(event) {
        const target = event.target;
        
        const actionBtn = target.closest('.action-btn');
        if (actionBtn) {
            const dropdown = actionBtn.nextElementSibling;
            document.querySelectorAll('.action-menu.show-menu').forEach(menu => {
                if (menu !== dropdown) menu.classList.remove('show-menu');
            });
            dropdown.classList.toggle('show-menu');
            event.stopPropagation();
        }

        const deleteBtn = target.closest('.delete-menu-btn');
        if (deleteBtn) {
            taskToDelete = deleteBtn.closest('.task-card');
            deleteConfirmModal.style.display = 'flex';
        }

        const statusOption = target.closest('.status-option');
        if (statusOption) {
            event.preventDefault();
            const card = statusOption.closest('.task-card');
            const newStatus = statusOption.dataset.newStatus;

            card.dataset.status = newStatus;

            const checkCircle = card.querySelector('.task-check');
            checkCircle.className = 'task-check';
            checkCircle.classList.add(`status-${newStatus}`);

            const statusTextElement = card.querySelector('.status-text');
            statusTextElement.textContent = newStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            statusTextElement.className = `status-text ${newStatus}`;

            // Perbarui filter setelah status diubah
            filterTasks();
        }
    });
    
    window.addEventListener('click', (e) => {
        if (!e.target.closest('.task-actions')) {
            document.querySelectorAll('.action-menu.show-menu').forEach(menu => {
                menu.classList.remove('show-menu');
            });
        }
    });

    // --- Fungsi dan Event Listener untuk Filter ---
    function filterTasks() {
        const selectedStatus = taskFilter.value;
        const allTasks = taskList.querySelectorAll('.task-card');

        allTasks.forEach(task => {
            if (selectedStatus === 'all' || task.dataset.status === selectedStatus) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
    }

    taskFilter.addEventListener('change', filterTasks);

    // Inisialisasi
    setupModalControls();
    setupImageUpload();
});