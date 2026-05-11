window.addEventListener("DOMContentLoaded", async () => {
  console.log("JS LOADED");

  // === 1. LOGIC FOR INDEX.HTML (USERS PAGE) ===
  const roomsContainer = document.getElementById('rooms');
  if (roomsContainer) {
    const res = await fetch('/api/rooms');
    const rooms = await res.json();
    
    roomsContainer.innerHTML = '';
    rooms.forEach(room => {
      const div = document.createElement('div');
      div.className = 'card';
      
      const diffClass = (room.difficulty || 'easy').toLowerCase();
      
      div.innerHTML = `
        <div>
          <h2 style="margin-top:0; color: #fff; margin-bottom: 10px;">${room.name}</h2>
          <span class="badge ${diffClass}">${room.difficulty || 'Unknown'}</span>
        </div>
        <p class="room-description">${room.description || 'A mysterious room waiting to be explored...'}</p>
        <div class="theme-section">
          <div class="theme-label">Theme: ${room.themeId?.name || 'None'}</div>
          <p class="theme-description">${room.themeId?.description || 'No theme description available.'}</p>
        </div>
      `;
      roomsContainer.appendChild(div);
    });
  }

  // === 2. LOGIC FOR ADMIN.HTML ===
  const select = document.getElementById('themeSelect');
  const editRoomThemeSelect = document.getElementById('editRoomThemeSelect');
  const adminThemesContainer = document.getElementById('adminThemes');
  const adminRoomsContainer = document.getElementById('adminRooms');

  if (select || adminThemesContainer || adminRoomsContainer) {
    const themeRes = await fetch('/admin/themes');
    const themes = await themeRes.json();

    if (select) {
      select.innerHTML = '<option value="">Select a Theme...</option>';
      themes.forEach(t => {
        const opt = `<option value="${t._id}">${t.name}</option>`;
        select.innerHTML += opt;
        if(editRoomThemeSelect) editRoomThemeSelect.innerHTML += opt;
      });
    }

    if (adminThemesContainer) {
      adminThemesContainer.innerHTML = '';
      themes.forEach(t => {
        const details = document.createElement('details');
        const safeDesc = (t.description || '').replace(/[\n\r]/g, '\\n').replace(/'/g, "\\'");
        
        details.innerHTML = `
          <summary>${t.name}</summary>
          <div class="details-content">
            <p><strong>Description:</strong><br/> ${t.description || 'No description'}</p>
            <div style="margin-top: 15px;">
              <button style="background: #fbc531; color: black; width: auto; padding: 8px 15px; margin-right: 10px;" 
                onclick="openEditTheme('${t._id}', '${t.name.replace(/'/g, "\\'")}', '${safeDesc}')">
                Edit
              </button>
              <button style="background: #ff4b2b; color: white; width: auto; padding: 8px 15px;" 
                onclick="deleteTheme('${t._id}')">
                Delete
              </button>
            </div>
          </div>
        `;
        adminThemesContainer.appendChild(details);
      });
    }

    if (adminRoomsContainer) {
      const roomRes = await fetch('/api/rooms'); 
      const rooms = await roomRes.json();
      
      adminRoomsContainer.innerHTML = '';
      rooms.forEach(room => {
        const details = document.createElement('details');
        const safeRoomDesc = (room.description || '').replace(/[\n\r]/g, '\\n').replace(/'/g, "\\'");
        const diffClass = (room.difficulty || 'easy').toLowerCase();

        details.innerHTML = `
          <summary>
            ${room.name} 
            <span class="badge ${diffClass}" style="margin-left: 10px; margin-bottom: 0;">${room.difficulty}</span>
          </summary>
          <div class="details-content">
            <p><strong>Room Story:</strong><br/> ${room.description || 'No description'}</p>
            <p><strong>Theme:</strong> ${room.themeId?.name || 'None'}</p>
            <div style="margin-top: 15px;">
              <button style="background: #fbc531; color: black; width: auto; padding: 8px 15px; margin-right: 10px;" 
                onclick="openEditRoom('${room._id}', '${room.name.replace(/'/g, "\\'")}', '${safeRoomDesc}', '${room.difficulty.replace(/'/g, "\\'")}', '${room.themeId?._id || ''}')">
                Edit
              </button>
              <button style="background: #ff4b2b; color: white; width: auto; padding: 8px 15px;" 
                onclick="deleteRoom('${room._id}')">
                Delete
              </button>
            </div>
          </div>
        `;
        adminRoomsContainer.appendChild(details);
      });
    }
  }

  // === 3. CREATE LISTENERS ===
  const createThemeBtn = document.getElementById('createThemeBtn');
  if (createThemeBtn) {
    createThemeBtn.addEventListener('click', async () => {
      const name = document.getElementById('themeName').value;
      const description = document.getElementById('themeDesc').value; 
      if(!name) return alert("Please enter a theme name");

      await fetch('/admin/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });
      alert('Theme created');
      window.location.reload(); 
    });
  }
});

// Function to Create Room
window.createRoom = async () => {
  const name = document.getElementById('roomName').value;
  const description = document.getElementById('roomDesc').value;
  const difficulty = document.getElementById('difficulty').value;
  const themeSelect = document.getElementById('themeSelect');
  
  if(!name) return alert("Please fill room name");

  const themeId = themeSelect.value ? themeSelect.value : null;

  await fetch('/admin/room', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, difficulty, themeId })
  });
  
  alert('Room created');
  window.location.reload(); 
};

// === EDITING & DELETING FUNCTIONS ===
window.openEditTheme = (id, name, desc) => {
  document.getElementById('editThemeSection').style.display = 'block';
  document.getElementById('editThemeId').value = id;
  document.getElementById('editThemeName').value = name;
  document.getElementById('editThemeDesc').value = desc;
  window.scrollTo({ top: 0, behavior: 'smooth' }); 
};

window.openEditRoom = (id, name, desc, difficulty, themeId) => {
  document.getElementById('editRoomSection').style.display = 'block';
  document.getElementById('editRoomId').value = id;
  document.getElementById('editRoomName').value = name;
  document.getElementById('editRoomDesc').value = desc;
  document.getElementById('editRoomDifficulty').value = difficulty;
  document.getElementById('editRoomThemeSelect').value = themeId;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.cancelEdit = (sectionId) => {
  document.getElementById(sectionId).style.display = 'none';
};

window.submitEditTheme = async () => {
  const id = document.getElementById('editThemeId').value;
  const name = document.getElementById('editThemeName').value;
  const description = document.getElementById('editThemeDesc').value;

  await fetch(`/admin/theme/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description })
  });
  
  alert('Theme updated!');
  window.location.reload();
};

window.submitEditRoom = async () => {
  const id = document.getElementById('editRoomId').value;
  const name = document.getElementById('editRoomName').value;
  const description = document.getElementById('editRoomDesc').value;
  const difficulty = document.getElementById('editRoomDifficulty').value;
  const themeId = document.getElementById('editRoomThemeSelect').value || null;

  await fetch(`/admin/room/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, difficulty, themeId })
  });
  
  alert('Room updated!');
  window.location.reload();
};

window.deleteTheme = async (id) => {
  if (!confirm("Are you sure you want to delete this theme?")) return;
  
  await fetch(`/admin/theme/${id}`, { method: 'DELETE' });
  alert('Theme deleted!');
  window.location.reload();
};

window.deleteRoom = async (id) => {
  if (!confirm("Are you sure you want to delete this room?")) return;
  
  await fetch(`/admin/room/${id}`, { method: 'DELETE' });
  alert('Room deleted!');
  window.location.reload();
};