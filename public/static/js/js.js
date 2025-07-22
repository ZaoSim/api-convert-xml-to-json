let conversionType = 'json-to-xml';
        let currentTab = 'text';

        // Configuração do endpoint para envio (MODIFIQUE AQUI)
        const SEND_ENDPOINT = 'https://seu-servidor.com/api/upload'; // Substitua pela sua URL
        
        // Inicialização
        document.addEventListener('DOMContentLoaded', function() {
            loadSavedFiles();
            
            // Event listeners para radio buttons
            document.querySelectorAll('input[name="conversion"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    conversionType = this.value;
                    updateUI();
                });
            });

            // Event listener para upload de arquivo
            document.getElementById('file-input').addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        document.getElementById('file-content').value = e.target.result;
                        document.getElementById('file-content').style.display = 'block';
                        document.getElementById('file-name').textContent = `Arquivo: ${file.name}`;
                    };
                    reader.readAsText(file);
                }
            });
        });

        function switchTab(tab) {
            currentTab = tab;
            
            // Atualizar botões
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            // Atualizar conteúdo
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tab + '-tab').classList.add('active');

            updateUI();
        }

        function updateUI() {
            const isJsonToXml = conversionType === 'json-to-xml';
            const inputFormat = isJsonToXml ? 'JSON' : 'XML';
            const outputFormat = isJsonToXml ? 'XML' : 'JSON';

            // Atualizar placeholders e textos
            document.getElementById('input-text').placeholder = `Cole seu código ${inputFormat} aqui...`;
            document.querySelector('.button-primary').textContent = `Converter para ${outputFormat}`;
            document.getElementById('file-input').accept = isJsonToXml ? '.json' : '.xml';
        }

        function convert() {
            const input = currentTab === 'text' ? 
                document.getElementById('input-text').value : 
                document.getElementById('file-content').value;

            if (!input.trim()) {
                alert('Por favor, insira algum conteúdo para converter.');
                return;
            }

            // Aqui você implementará a lógica de conversão
            const output = `<!-- Resultado da conversão ${conversionType} -->\n<!-- Entrada: ${input.length} caracteres -->\n<!-- Implementar lógica de conversão aqui -->\n\n${input}`;
            
            document.getElementById('output-text').value = output;
        }

        function copyOutput() {
            const output = document.getElementById('output-text').value;
            if (output) {
                navigator.clipboard.writeText(output);
                alert('Copiado para a área de transferência!');
            }
        }

        function downloadOutput() {
            const output = document.getElementById('output-text').value;
            if (output) {
                const extension = conversionType === 'json-to-xml' ? 'xml' : 'json';
                const blob = new Blob([output], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `converted.${extension}`;
                a.click();
                URL.revokeObjectURL(url);
            }
        }

        function saveCurrentFile() {
            const name = document.getElementById('save-name').value.trim();
            const input = currentTab === 'text' ? 
                document.getElementById('input-text').value : 
                document.getElementById('file-content').value;

            if (!name) {
                alert('Por favor, digite um nome para o arquivo.');
                return;
            }

            if (!input.trim()) {
                alert('Não há conteúdo para salvar.');
                return;
            }

            const fileType = conversionType.split('-')[0]; // 'json' ou 'xml'
            const savedFiles = JSON.parse(localStorage.getItem('savedFiles') || '[]');
            
            const fileData = {
                id: Date.now(),
                name: name,
                type: fileType,
                content: input,
                date: new Date().toLocaleDateString(),
                sent: false
            };

            savedFiles.push(fileData);
            localStorage.setItem('savedFiles', JSON.stringify(savedFiles));
            
            document.getElementById('save-name').value = '';
            loadSavedFiles();
            alert('Arquivo salvo com sucesso!');
        }

        function loadSavedFiles() {
            const savedFiles = JSON.parse(localStorage.getItem('savedFiles') || '[]');
            const container = document.getElementById('saved-files');
            
            if (savedFiles.length === 0) {
                container.innerHTML = '<div style="text-align: center; color: #6b7280; padding: 1rem;">Nenhum arquivo salvo</div>';
                return;
            }

            container.innerHTML = savedFiles.map(file => `
                <div class="file-item">
                    <div class="file-item-info">
                        <div class="file-item-name">
                            ${file.name} 
                            ${file.sent ? '<span style="color: #10b981;">✓</span>' : ''}
                        </div>
                        <div class="file-item-type">${file.type.toUpperCase()} • ${file.date}</div>
                    </div>
                    <div class="file-actions">
                        <button class="button button-secondary button-small" onclick="loadFile(${file.id})" title="Carregar">📂</button>
                        <button class="button button-success button-small" onclick="sendFile(${file.id})" title="Enviar" ${file.sent ? 'disabled' : ''}>📤</button>
                        <button class="button button-secondary button-small" onclick="deleteFile(${file.id})" title="Excluir">🗑️</button>
                    </div>
                </div>
            `).join('');
        }

        function loadFile(id) {
            const savedFiles = JSON.parse(localStorage.getItem('savedFiles') || '[]');
            const file = savedFiles.find(f => f.id === id);
            
            if (file) {
                // Definir o tipo de conversão baseado no tipo do arquivo
                const newConversionType = file.type === 'json' ? 'json-to-xml' : 'xml-to-json';
                document.querySelector(`input[value="${newConversionType}"]`).checked = true;
                conversionType = newConversionType;
                
                // Carregar conteúdo na aba de texto
                document.getElementById('input-text').value = file.content;
                switchTab('text');
                updateUI();
                
                alert(`Arquivo "${file.name}" carregado!`);
            }
        }

        function deleteFile(id) {
            if (confirm('Tem certeza que deseja excluir este arquivo?')) {
                const savedFiles = JSON.parse(localStorage.getItem('savedFiles') || '[]');
                const filteredFiles = savedFiles.filter(f => f.id !== id);
                localStorage.setItem('savedFiles', JSON.stringify(filteredFiles));
                loadSavedFiles();
            }
        }

        function clearAllFiles() {
            if (confirm('Tem certeza que deseja excluir todos os arquivos salvos?')) {
                localStorage.removeItem('savedFiles');
                loadSavedFiles();
                alert('Todos os arquivos foram excluídos!');
            }
        }

        // FUNÇÕES DE ENVIO DE ARQUIVOS

        async function sendFile(id) {
            const savedFiles = JSON.parse(localStorage.getItem('savedFiles') || '[]');
            const file = savedFiles.find(f => f.id === id);
            
            if (!file) {
                alert('Arquivo não encontrado!');
                return;
            }

            const button = event.target;
            const originalText = button.innerHTML;
            
            try {
                // Mostrar loading
                button.innerHTML = '<div class="loading"></div>';
                button.disabled = true;

                // Preparar dados para envio
                const formData = new FormData();
                const blob = new Blob([file.content], { type: 'text/plain' });
                formData.append('file', blob, `${file.name}.${file.type}`);
                formData.append('fileName', file.name);
                formData.append('fileType', file.type);
                formData.append('date', file.date);

                // Enviar arquivo (MODIFIQUE ESTA PARTE CONFORME SUA API)
                const response = await fetch(SEND_ENDPOINT, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    // Marcar como enviado
                    file.sent = true;
                    const updatedFiles = savedFiles.map(f => f.id === id ? file : f);
                    localStorage.setItem('savedFiles', JSON.stringify(updatedFiles));
                    
                    button.innerHTML = '✓';
                    button.style.background = '#10b981';
                    
                    showStatus('send-status', `Arquivo "${file.name}" enviado com sucesso!`, 'success');
                    loadSavedFiles();
                } else {
                    throw new Error(`Erro ${response.status}: ${response.statusText}`);
                }

            } catch (error) {
                console.error('Erro ao enviar arquivo:', error);
                button.innerHTML = originalText;
                button.disabled = false;
                showStatus('send-status', `Erro ao enviar "${file.name}": ${error.message}`, 'error');
            }
        }

        async function sendCurrentFile() {
            const input = currentTab === 'text' ? 
                document.getElementById('input-text').value : 
                document.getElementById('file-content').value;

            if (!input.trim()) {
                alert('Não há conteúdo para enviar.');
                return;
            }

            const button = document.getElementById('send-current-btn');
            const originalText = button.innerHTML;
            
            try {
                // Mostrar loading
                button.innerHTML = '<div class="loading"></div> Enviando...';
                button.disabled = true;

                const fileType = conversionType.split('-')[0];
                const fileName = `arquivo_atual_${Date.now()}`;

                // Preparar dados para envio
                const formData = new FormData();
                const blob = new Blob([input], { type: 'text/plain' });
                formData.append('file', blob, `${fileName}.${fileType}`);
                formData.append('fileName', fileName);
                formData.append('fileType', fileType);
                formData.append('date', new Date().toLocaleDateString());

                // Enviar arquivo
                const response = await fetch(SEND_ENDPOINT, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    button.innerHTML = '✓ Enviado';
                    button.style.background = '#10b981';
                    showStatus('send-status', 'Arquivo atual enviado com sucesso!', 'success');
                    
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.style.background = '#10b981';
                        button.disabled = false;
                    }, 3000);
                } else {
                    throw new Error(`Erro ${response.status}: ${response.statusText}`);
                }

            } catch (error) {
                console.error('Erro ao enviar arquivo atual:', error);
                button.innerHTML = originalText;
                button.disabled = false;
                showStatus('send-status', `Erro ao enviar arquivo: ${error.message}`, 'error');
            }
        }

        async function sendAllFiles() {
            const savedFiles = JSON.parse(localStorage.getItem('savedFiles') || '[]');
            const unsentFiles = savedFiles.filter(f => !f.sent);
            
            if (unsentFiles.length === 0) {
                alert('Não há arquivos para enviar ou todos já foram enviados.');
                return;
            }

            if (!confirm(`Enviar ${unsentFiles.length} arquivo(s)?`)) {
                return;
            }

            const button = event.target;
            const originalText = button.innerHTML;
            
            try {
                button.innerHTML = '<div class="loading"></div> Enviando...';
                button.disabled = true;

                let successCount = 0;
                let errorCount = 0;

                for (const file of unsentFiles) {
                    try {
                        const formData = new FormData();
                        const blob = new Blob([file.content], { type: 'text/plain' });
                        formData.append('file', blob, `${file.name}.${file.type}`);
                        formData.append('fileName', file.name);
                        formData.append('fileType', file.type);
                        formData.append('date', file.date);

                        const response = await fetch(SEND_ENDPOINT, {
                            method: 'POST',
                            body: formData
                        });

                        if (response.ok) {
                            file.sent = true;
                            successCount++;
                        } else {
                            errorCount++;
                        }
                    } catch (error) {
                        errorCount++;
                    }
                }

                // Atualizar localStorage
                localStorage.setItem('savedFiles', JSON.stringify(savedFiles));
                loadSavedFiles();

                // Mostrar resultado
                const message = `Envio concluído: ${successCount} sucesso(s), ${errorCount} erro(s)`;
                showStatus('global-send-status', message, errorCount === 0 ? 'success' : 'error');

            } catch (error) {
                showStatus('global-send-status', `Erro geral: ${error.message}`, 'error');
            } finally {
                button.innerHTML = originalText;
                button.disabled = false;
            }
        }

        function showStatus(elementId, message, type) {
            const statusDiv = document.getElementById(elementId);
            statusDiv.innerHTML = `<div class="status-message status-${type}">${message}</div>`;
            
            setTimeout(() => {
                statusDiv.innerHTML = '';
            }, 5000);
        }

        // Inicializar UI
        updateUI();