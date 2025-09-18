// Tunggu hingga seluruh halaman dimuat
document.addEventListener('DOMContentLoaded', function() {

    // Ambil elemen-elemen yang dibutuhkan
    const addTaskButton = document.querySelector('.add-task-btn');
    const closeModalButton = document.getElementById('close-modal-btn');
    const modal = document.getElementById('add-task-modal');

    // Fungsi untuk menampilkan modal
    function showModal() {
        modal.style.display = 'flex'; // Ganti display menjadi 'flex' untuk menampilkan
    }

    // Fungsi untuk menyembunyikan modal
    function hideModal() {
        modal.style.display = 'none'; // Ganti display menjadi 'none' untuk menyembunyikan
    }

    // Tambahkan event listener ke tombol "Add task"
    addTaskButton.addEventListener('click', function(event) {
        event.preventDefault(); // Mencegah link berpindah halaman
        showModal();
    });

    // Tambahkan event listener ke tombol "Go Back"
    closeModalButton.addEventListener('click', function(event) {
        event.preventDefault();
        hideModal();
    });

    // Opsional: Sembunyikan modal jika pengguna mengklik di luar area konten modal
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            hideModal();
        }
    });

});