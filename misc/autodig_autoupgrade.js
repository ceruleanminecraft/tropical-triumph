let previousCooldown = null;
let autoUpgradeEnabled = false;

function logCurrentTime() {
  const currentTime = new Date();
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');
  console.log(`${hours}:${minutes}:${seconds}`);
}

function logShellsCollected(shellsCollected) {
  const shellsColor = getShellsColor(shellsCollected);
  console.log(`Shells collected: %c${shellsCollected}`, shellsColor);
}

function logItemsCollected(items) {
  if (items.length > 0) {
    const itemNames = items.map(item => item.item).join(', ');
    console.log('Items collected:', itemNames);
  } else {
    console.log('No items collected.');
  }
}

function upgrade() {
  fetch('https://event.blacket.org/api/upgrade', {
    method: 'POST',
    body: JSON.stringify({}),
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Request failed');
      }
    })
    .then(data => {
      console.log('Upgrade Response:', data);
    })
    .catch(error => {
      console.log('Upgrade Error:', error.message);
    });
}

function getShellsColor(shellsCollected) {
  const minShells = 0;
  const maxShells = 500;

  const minColor = [255, 0, 0];
  const maxColor = [0, 255, 0];

  const progress = (shellsCollected - minShells) / (maxShells - minShells);
  const interpolatedColor = interpolateColor(minColor, maxColor, progress);

  const colorHex = rgbToHex(interpolatedColor);
  return `color: ${colorHex}; font-weight: bold;`;
}

function interpolateColor(color1, color2, progress) {
  const r = Math.round(lerp(color1[0], color2[0], progress));
  const g = Math.round(lerp(color1[1], color2[1], progress));
  const b = Math.round(lerp(color1[2], color2[2], progress));
  return [r, g, b];
}

function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function rgbToHex(rgb) {
  const r = componentToHex(rgb[0]);
  const g = componentToHex(rgb[1]);
  const b = componentToHex(rgb[2]);
  return `#${r}${g}${b}`;
}

function fetchDigResults() {
  fetch('https://event.blacket.org/api/dig', {
    method: 'POST',
    body: JSON.stringify({}),
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Request failed');
      }
    })
    .then(data => {
      console.log('Dig Results:', data);

      if (typeof data === 'object') {
        if (data.error === false) {
          const shellsCollected = data.rewards.shells;
          logShellsCollected(shellsCollected);

          if (data.rewards.items && data.rewards.items.length > 0) {
            logItemsCollected(data.rewards.items);
          } else {
            console.log('No items collected.');
          }
        } else {
          if (data.reason && data.reason.includes('cooldown')) {
            const cooldown = parseInt(data.reason.match(/\d+/)[0]);
            if (cooldown !== previousCooldown) {
              console.log('Cooldown:', cooldown, 'seconds');
              previousCooldown = cooldown;
            }
          }
        }
      }
    })
    .catch(error => {
      console.log('Error:', error.message);
    });
}

function runLoop() {
  logCurrentTime();
  fetchDigResults();

  if (autoUpgradeEnabled) {
    upgrade();
  }
}

function promptAutoUpgrade() {
  const promptMessage = 'Would you like to turn on automatic upgrades? (Type "yes", anything else will disable this)';
  const userInput = prompt(promptMessage);

  if (userInput && userInput.toLowerCase() === 'yes') {
    autoUpgradeEnabled = true;
    console.log('Automatic upgrades enabled.');
  } else {
    autoUpgradeEnabled = false;
    console.log('Automatic upgrades disabled.');
  }
}

promptAutoUpgrade();
setInterval(runLoop, 3000);
