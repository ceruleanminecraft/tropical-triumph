let previousCooldown = null;

function logCurrentTime() {
  fetch('https://event-dev.blacket.org/api/dig', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Origin': 'https://event-dev.blacket.org',
      'Referer': 'https://event-dev.blacket.org/dig',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    },
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
      if (typeof data === 'object') {
        if (data.error === false) {
          const currentTime = new Date();
          const hours = currentTime.getHours().toString().padStart(2, '0');
          const minutes = currentTime.getMinutes().toString().padStart(2, '0');
          const seconds = currentTime.getSeconds().toString().padStart(2, '0');
          console.log(`${hours}:${minutes}:${seconds}`);
          
          const shellsCollected = data.rewards.shells;
          const shellsColor = getShellsColor(shellsCollected);
          console.log(`Shells collected: %c${shellsCollected}`, shellsColor);

          if (data.rewards.items && data.rewards.items.length > 0) {
            const items = data.rewards.items.map(item => item.item).join(', ');
            console.log('Items collected:', items);
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

function getShellsColor(shellsCollected) {
  const minShells = 0;
  const maxShells = 500;
  
  const minColor = [255, 0, 0];   // Red
  const maxColor = [0, 255, 0];   // Green
  
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

setInterval(logCurrentTime, 1000);