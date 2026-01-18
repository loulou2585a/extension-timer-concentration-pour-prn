setTimeout(() => {
  const menu = document.querySelector('ul#GInterface\\.Instances\\[0\\]\\.Instances\\[1\\]_Wrapper.menu-principal_niveau0');

  if (!menu) {
    console.warn("⛔ Menu non trouvé après délai.");
    return;
  }

  // Création du li avec le bouton
  const li = document.createElement('li');
  li.className = "item-menu_niveau0 SansMain is-collapse avec-sousmenu";
  li.tabIndex = 0;
  li.role = "menuitem";
  li.setAttribute("aria-expanded", "false");
  li.setAttribute("aria-haspopup", "true");
  li.setAttribute("aria-controls", "GInterface.Instances[0].Instances[1]_Liste_niveau6");

  const divLabel = document.createElement('div');
  divLabel.id = "GInterface.Instances[0].Instances[1]_Combo6";
  divLabel.className = "label-menu_niveau0";
  divLabel.setAttribute("aria-atomic", "true");
  divLabel.textContent = "Timer de concentration";
  divLabel.style.cursor = 'pointer';

  const divSubmenu = document.createElement('div');
  divSubmenu.id = "GInterface.Instances[0].Instances[1]_Liste_niveau6";
  divSubmenu.className = "submenu-wrapper";
  divSubmenu.style.height = "6.4rem";

  li.appendChild(divLabel);
  li.appendChild(divSubmenu);
  menu.appendChild(li);
  console.log("✅ Bouton Timer injecté !");

  // Création de la modale timer (cachée au départ)
  const modal = document.createElement('div');
  modal.id = 'timerModal';
  Object.assign(modal.style, {
    position: 'fixed',
    top: '100px',
    left: '100px',
    backgroundColor: '#222',
    color: '#eee',
    padding: '15px',
    borderRadius: '8px',
    zIndex: '9999',
    display: 'none',
    fontFamily: 'Arial, sans-serif',
    minWidth: '280px',
    boxShadow: '0 0 15px rgba(0,0,0,0.7)',
    userSelect: 'none',
    cursor: 'default',
  });

  modal.innerHTML = `
    <div id="modalHeader" style="cursor: move; padding: 8px; background: #333; border-radius: 6px 6px 0 0; font-weight: bold; user-select:none;">
      Timer de concentration
      <button id="closeTimerBtn" style="float:right; background:#900; border:none; color:#eee; cursor:pointer; padding: 2px 8px; border-radius: 4px;">×</button>
    </div>
    <div style="margin-top: 15px; text-align:center;">
      <div id="timerDisplay" style="font-size: 2.5rem; margin-bottom: 15px;">25:00</div>
      <label for="timeInput" style="font-size: 0.9rem;">Temps (minutes) :</label>
      <input type="number" id="timeInput" min="1" max="180" value="25" style="width: 60px; margin-left: 10px; font-size: 1rem; text-align: center; border-radius: 4px; border:none; padding: 4px;">
    </div>
    <div style="text-align:center; margin-top: 10px;">
      <button id="startTimerBtn" style="padding: 6px 15px; margin-right: 10px; font-size: 1rem; cursor: pointer;">Démarrer</button>
      <button id="pauseTimerBtn" style="padding: 6px 15px; margin-right: 10px; font-size: 1rem; cursor: pointer;" disabled>Pause</button>
      <button id="resetTimerBtn" style="padding: 6px 15px; font-size: 1rem; cursor: pointer;" disabled>Réinitialiser</button>
    </div>
  `;
  document.body.appendChild(modal);

  // Variables timer
  let timerInterval = null;
  let totalSeconds = 25 * 60;
  let remainingSeconds = totalSeconds;
  let isPaused = false;

  // Éléments
  const timerDisplay = modal.querySelector('#timerDisplay');
  const timeInput = modal.querySelector('#timeInput');
  const startBtn = modal.querySelector('#startTimerBtn');
  const pauseBtn = modal.querySelector('#pauseTimerBtn');
  const resetBtn = modal.querySelector('#resetTimerBtn');
  const closeBtn = modal.querySelector('#closeTimerBtn');

  // Met à jour l’affichage du timer
  function updateTimerDisplay(seconds) {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${min}:${sec}`;
  }

  // Démarre le timer
  function startTimer() {
    if (timerInterval) return; // déjà démarré

    if (remainingSeconds <= 0) {
      remainingSeconds = totalSeconds;
    }

    timerInterval = setInterval(() => {
      if (!isPaused) {
        remainingSeconds--;
        if (remainingSeconds < 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          alert('⏰ Temps écoulé !');
          updateTimerDisplay(0);
          pauseBtn.disabled = true;
          resetBtn.disabled = false;
          startBtn.disabled = false;
        } else {
          updateTimerDisplay(remainingSeconds);
        }
      }
    }, 1000);

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
  }

  // Pause / reprise
  function togglePause() {
    if (!timerInterval) return;
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Reprendre' : 'Pause';
  }

  // Réinitialise le timer
  function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = false;

    totalSeconds = parseInt(timeInput.value, 10) * 60;
    if (isNaN(totalSeconds) || totalSeconds <= 0) totalSeconds = 25 * 60;

    remainingSeconds = totalSeconds;
    updateTimerDisplay(remainingSeconds);

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
    resetBtn.disabled = true;
  }

  // Ferme la modale
  function closeModal() {
    resetTimer();
    modal.style.display = 'none';
  }

  // Ouvre la modale
  divLabel.addEventListener('click', () => {
    modal.style.display = 'block';
    // Met à jour le timer à l’ouverture avec la valeur actuelle
    resetTimer();
  });

  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', togglePause);
  resetBtn.addEventListener('click', resetTimer);
  closeBtn.addEventListener('click', closeModal);

  // Draggable modal
  (function makeDraggable(element, handle) {
    let posX = 0, posY = 0, mouseX = 0, mouseY = 0;

    handle.style.cursor = 'move';
    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e.preventDefault();
      mouseX = e.clientX;
      mouseY = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e.preventDefault();
      posX = mouseX - e.clientX;
      posY = mouseY - e.clientY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      element.style.top = (element.offsetTop - posY) + "px";
      element.style.left = (element.offsetLeft - posX) + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  })(modal, modal.querySelector('#modalHeader'));

  // Initial display
  updateTimerDisplay(totalSeconds);
}, 2000);
