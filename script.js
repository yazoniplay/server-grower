(() => {
  const $ = (id) => document.getElementById(id);
  const form = $('listingForm');
  const nameInput = $('serverName');
  const editionInput = $('edition');
  const modeInput = $('gamemode');
  const audienceInput = $('audience');
  const featuresInput = $('features');
  const communityInput = $('community');
  const toneInput = $('tone');
  const addressInput = $('address');
  const portInput = $('port');
  const output = $('outputText');
  const toast = $('toast');
  let toastTimer;

  const clean = (value) => value.trim();
  const featureList = () => clean(featuresInput.value).split(/[\n,;]+/).map(x => x.trim()).filter(Boolean).slice(0, 3);

  function notify(message, error = false) {
    toast.textContent = message;
    toast.classList.toggle('error', error);
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  function serverAddress() {
    const address = clean(addressInput.value);
    const port = clean(portInput.value);
    if (!address) return 'your.server.address';
    if (editionInput.value === 'Bedrock' || editionInput.value === 'Java & Bedrock') {
      return port && port !== '19132' ? address + ' : ' + port : address + (port ? ' : ' + port : '');
    }
    return address;
  }

  function makeDescription() {
    const name = clean(nameInput.value) || 'Our Minecraft server';
    const mode = modeInput.value;
    const audience = clean(audienceInput.value);
    const features = featureList();
    const community = communityInput.value.toLowerCase();
    const tone = toneInput.value;
    const featureSentence = features.length
      ? 'What makes us different: ' + features.join(', ') + '.'
      : 'Come explore, find your playstyle, and help shape the community.';
    const audienceSentence = audience ? ' Made for ' + audience.replace(/[.!?]+$/, '') + '.' : '';
    const openers = {
      balanced: name + ' is a ' + mode.toLowerCase() + ' server built for players who want a ' + community + ' place to play.',
      energetic: 'Your next Minecraft adventure starts at ' + name + '! Jump into our ' + mode.toLowerCase() + ' world and make your mark.',
      minimal: name + ' — ' + mode + '. A ' + community + ' Minecraft community.'
    };
    const invitation = {
      balanced: 'Join us, meet other players, and make the world your own.',
      energetic: 'Bring your ideas, invite a friend, and come make something memorable!',
      minimal: 'Join in and make it yours.'
    };
    const paragraphs = [openers[tone] + audienceSentence, featureSentence, invitation[tone]];
    if (editionInput.value === 'Java & Bedrock') paragraphs.push('Java and Bedrock players are welcome.');
    else if (editionInput.value === 'Java') paragraphs.push('For Minecraft Java Edition players.');
    else paragraphs.push('For Minecraft Bedrock Edition players.');
    return paragraphs.join('\n\n');
  }

  function renderPreview() {
    const name = clean(nameInput.value);
    $('previewName').textContent = name || 'Your server name';
    $('serverAvatar').textContent = name ? name.charAt(0).toUpperCase() : '?';
    $('previewEdition').textContent = editionInput.value.toUpperCase() + (editionInput.value === 'Java & Bedrock' ? '' : ' EDITION');
    $('previewMode').textContent = modeInput.value.toUpperCase();
    $('previewAddress').textContent = serverAddress();
    const features = featureList();
    const tags = $('previewTags');
    tags.replaceChildren();
    if (features.length) {
      features.forEach(feature => {
        const tag = document.createElement('span');
        tag.className = 'feature-tag';
        tag.textContent = feature;
        tags.appendChild(tag);
      });
    } else {
      const tag = document.createElement('span');
      tag.className = 'feature-tag muted-tag';
      tag.textContent = 'Your features will show here';
      tags.appendChild(tag);
    }
    $('featureCount').textContent = featuresInput.value.length;
  }

  function updateWordCount() {
    const words = output.value.trim() ? output.value.trim().split(/\s+/).length : 0;
    $('wordCount').textContent = words + (words === 1 ? ' word' : ' words');
    $('previewDescription').textContent = output.value.trim() || 'Your server description will appear here. Add a name and a few details, then generate your first listing.';
  }

  function generateListing(event) {
    if (event) event.preventDefault();
    if (!clean(nameInput.value)) {
      nameInput.focus();
      notify('Add your server name first.', true);
      return;
    }
    output.value = makeDescription();
    updateWordCount();
    notify('Listing generated. Review it before publishing.');
  }

  async function copyText(text, successMessage) {
    if (!text.trim()) {
      notify('Generate your listing first.', true);
      return;
    }
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const helper = document.createElement('textarea');
        helper.value = text;
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.select();
        const copied = document.execCommand('copy');
        helper.remove();
        if (!copied) throw new Error('Copy unavailable');
      }
      notify(successMessage);
    } catch {
      notify('Copy was blocked by your browser. Select the text and copy it manually.', true);
    }
  }

  form.addEventListener('submit', generateListing);
  [nameInput, editionInput, modeInput, audienceInput, featuresInput, communityInput, toneInput, addressInput, portInput].forEach(el => {
    el.addEventListener('input', renderPreview);
    el.addEventListener('change', renderPreview);
  });
  output.addEventListener('input', updateWordCount);
  $('copyListing').addEventListener('click', () => copyText(output.value, 'Listing copied to clipboard.'));
  $('copyAddress').addEventListener('click', () => {
    const address = clean(addressInput.value);
    if (!address) return notify('Add your server address first.', true);
    const value = (editionInput.value === 'Bedrock' || editionInput.value === 'Java & Bedrock')
      ? address + ':' + (clean(portInput.value) || '19132')
      : address;
    copyText(value, 'Server address copied.');
  });
  $('downloadListing').addEventListener('click', () => {
    if (!output.value.trim()) return notify('Generate your listing first.', true);
    const file = new Blob([output.value + '\n\nEdition: ' + editionInput.value + '\nGame mode: ' + modeInput.value + '\nServer address: ' + (clean(addressInput.value) || 'Not provided')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    const safeName = (clean(nameInput.value) || 'minecraft-server').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    link.download = safeName + '-listing.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notify('Your listing file is ready.');
  });
  $('dismissNotice').addEventListener('click', () => $('dismissNotice').closest('.notice').remove());

  document.querySelectorAll('.nav-item').forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.view !== 'studio') {
        notify(button.dataset.view === 'planner' ? 'Promotion Planner is planned for a future update.' : 'Growth Tracker is planned for a future update.');
        return;
      }
      document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item === button));
      document.querySelector('.page-heading').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  renderPreview();
  updateWordCount();
})();