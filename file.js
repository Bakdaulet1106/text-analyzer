document.getElementById('dropZone').addEventListener('dragover', e => e.preventDefault());
document.getElementById('dropZone').addEventListener('drop', handleFileDrop);

async function handleFileDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    await processFile(file);
}

async function processFile(file) {
    if (!file) return;
    document.getElementById('fileInfo').innerHTML = `📄 ${file.name} (${(file.size/1024).toFixed(1)} KB)`;

    if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({arrayBuffer});
        document.getElementById('textInput').value = result.value;
    } else {
        const reader = new FileReader();
        reader.onload = e => document.getElementById('textInput').value = e.target.result;
        reader.readAsText(file);
    }
}

function analyzeContent() {
    const text = document.getElementById('textInput').value.trim();
    if (!text) return alert('⚠️ Введите текст!');

    document.getElementById('charCount').textContent = text.length;
    document.getElementById('wordCount').textContent = text.split(/\s+/).filter(w => w).length;
    document.getElementById('sentenceCount').textContent = text.split(/[.!?]+/).filter(s => s.trim()).length;
}

function searchText() {
    const text = document.getElementById('textInput').value;
    const query = document.getElementById('searchQuery').value;
    if (!query) return alert('Введите запрос!');

    const caseSensitive = document.getElementById('caseSensitive').checked;
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    const matches = text.match(regex) || [];
    document.getElementById('searchResults').textContent = matches.length;
    document.getElementById('highlightedText').innerHTML = text.replace(regex, match => `<span class="highlight">${match}</span>`);
}

function exportResults() {
    const text = document.getElementById('textInput').value;
    const blob = new Blob([text], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis_${new Date().toISOString()}.txt`;
    a.click();
}

function clearAll() {
    document.getElementById('textInput').value = '';
    document.getElementById('fileInfo').innerHTML = '';
    document.querySelectorAll('.stat-value').forEach(el => el.textContent = '0');
    document.getElementById('highlightedText').innerHTML = '';
}