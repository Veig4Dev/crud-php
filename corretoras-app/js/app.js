$(document).ready(function () {
    const authToken = 'Bearer t0kenP@ss'; // Token fixo

    // Função para mostrar mensagens de status
    function showStatusMessage(message, type) {
        const statusDiv = $('#status-message');
        statusDiv.text(message);
        statusDiv.removeClass('alert-success alert-danger');
        statusDiv.addClass(`alert-${type}`);
        setTimeout(() => statusDiv.text(''), 3000); 
    }

    // Função para listar corretoras
    function listarCorretoras() {
        $.ajax({
            url: '/api/corretoras.php',
            method: 'GET',
            headers: {
                'Authorization': authToken
            },
            success: function (response) {
                try {
                    let corretoras = JSON.parse(response);
                    $('#lista-corretoras').empty();
                    corretoras.forEach(corretora => {
                        $('#lista-corretoras').append(`
                            <li class="list-group-item">
                                ${corretora.nome_fantasia} - ${corretora.cnpj}
                                <button class="btn btn-warning btn-sm float-end mx-2" onclick="editarCorretora(${corretora.id})">Editar</button>
                                <button class="btn btn-danger btn-sm float-end" onclick="excluirCorretora(${corretora.id})">Excluir</button>
                            </li>
                        `);
                    });
                } catch (e) {
                    console.error('Erro ao analisar JSON:', e);
                }
            },
            error: function (xhr, status, error) {
                console.error('Erro na requisição:', error);
            }
        });
    }

    // Função para cadastrar corretora
    $('#form-corretora').on('submit', function (e) {
        e.preventDefault();

        let corretoraData = {
            nome_fantasia: $('#nome_fantasia').val(),
            razao_social: $('#razao_social').val(),
            cnpj: $('#cnpj').val(),
            endereco: $('#endereco').val()
        };

        $.ajax({
            url: '/api/corretoras.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(corretoraData),
            headers: {
                'Authorization': authToken
            },
            success: function (response) {
                try {
                    let jsonResponse = JSON.parse(response);
                    showStatusMessage(jsonResponse.success || jsonResponse.error, jsonResponse.success ? 'success' : 'danger');
                    listarCorretoras();  

                    // Limpar os campos do formulário após o cadastro
                    $('#nome_fantasia').val('');
                    $('#razao_social').val('');
                    $('#cnpj').val('');
                    $('#endereco').val('');
                } catch (e) {
                    console.error('Erro ao analisar JSON:', e);
                }
            },
            error: function (xhr, status, error) {
                console.error('Erro na requisição:', error);
            }
        });
    });

    // Função para excluir corretora
    window.excluirCorretora = function (id) {
        $.ajax({
            url: '/api/corretoras.php',
            method: 'DELETE',
            data: $.param({ id: id }),
            headers: {
                'Authorization': authToken
            },
            success: function (response) {
                try {
                    let jsonResponse = JSON.parse(response);
                    showStatusMessage(jsonResponse.success || jsonResponse.error, jsonResponse.success ? 'success' : 'danger');
                    listarCorretoras();  // Atualizar a listagem
                } catch (e) {
                    console.error('Erro ao analisar JSON:', e);
                }
            },
            error: function (xhr, status, error) {
                console.error('Erro na requisição:', error);
            }
        });
    };

    // Função para abrir o modal e carregar os dados da corretora para edição
    window.editarCorretora = function (id) {
        $.ajax({
            url: `/api/corretoras.php?id=${id}`,
            method: 'GET',
            headers: {
                'Authorization': authToken
            },
            success: function (response) {
                try {
                    let corretora = JSON.parse(response)[0];
                    $('#nome_fantasia_edit').val(corretora.nome_fantasia);
                    $('#razao_social_edit').val(corretora.razao_social);
                    $('#cnpj_edit').val(corretora.cnpj);
                    $('#endereco_edit').val(corretora.endereco);
                    $('#corretora_id').val(corretora.id);

                    // Mostrar o modal
                    $('#editModal').modal('show');
                } catch (e) {
                    console.error('Erro ao analisar JSON:', e);
                }
            },
            error: function (xhr, status, error) {
                console.error('Erro na requisição:', error);
            }
        });
    };

    // Função para atualizar corretora
    $('#form-edit-corretora').on('submit', function (e) {
        e.preventDefault();

        let corretoraData = {
            id: $('#corretora_id').val(),
            nome_fantasia: $('#nome_fantasia_edit').val(),
            razao_social: $('#razao_social_edit').val(),
            cnpj: $('#cnpj_edit').val(),
            endereco: $('#endereco_edit').val()
        };

        $.ajax({
            url: '/api/corretoras.php',
            method: 'PUT',
            contentType: 'application/x-www-form-urlencoded',
            data: $.param(corretoraData),
            headers: {
                'Authorization': authToken
            },
            success: function (response) {
                try {
                    let jsonResponse = JSON.parse(response);
                    showStatusMessage(jsonResponse.success || jsonResponse.error, jsonResponse.success ? 'success' : 'danger');
                    listarCorretoras();  

                    $('#editModal').modal('hide');
                } catch (e) {
                    console.error('Erro ao analisar JSON:', e);
                }
            },
            error: function (xhr, status, error) {
                console.error('Erro na requisição:', error);
            }
        });
    });

    // Inicializar listagem
    listarCorretoras();
});
