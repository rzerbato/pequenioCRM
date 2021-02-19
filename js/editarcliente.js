(function(){

    let DB;
    let idCliente;

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');
    const formula = document.querySelector('#formula');

    document.addEventListener('DOMContentLoaded', () =>{

        conectarDB();

        formulario.addEventListener('submit', actualizarCliente);

        //leer parametros de la url
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');
        
        if(idCliente) {
            //Este setTimeout se reemplaza utilizando async await
            setTimeout(() => {
                obtenerCliente(idCliente);                
            }, 100);
        }
    });

    function obtenerCliente(id){ 
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        const clientes = objectStore.openCursor();

        clientes.onsuccess = (e) => {
            const cursor = e.target.result;

            if(cursor) {
                

                if( cursor.value.id === Number(id) ){
                    llenarFormulario(cursor.value);
                }

                cursor.continue();
            }
        }
    }

    function actualizarCliente(e){
        e.preventDefault();

        if(nombreInput.value === '' || emailInput.value === '' || empresaInput.value === '' || telefonoInput === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        //Actualizo el cliente
        const clienteActualizado = {
            nombre: nombreInput.value,
            email : emailInput.value,
            empresa: empresaInput.value,
            telefono: telefonoInput.value,
            id: Number(idCliente)
        }

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        objectStore.put(clienteActualizado);

        transaction.oncomplete = () => {
            imprimirAlerta('Editado correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }

        transaction.onerror = () => {
            imprimirAlerta('Hubo un error', 'error');
        }
    }

    function imprimirAlerta(mensaje, tipo){
        
        const alerta = document.querySelector('.alerta');
        
        if(!alerta){

            //Crear el mensaje
            const divMensaje = document.createElement('div');
            divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');
            
            if( tipo === 'error' ){
                divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
            }else {
                divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
            }

            divMensaje.textContent = mensaje;
            
            formulario.appendChild(divMensaje);
            
            setTimeout(() => {
                divMensaje.remove();
            }, 3000);
        }
    }

    function llenarFormulario(cliente){
        const { nombre, email, telefono, empresa } = cliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;

    }

    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function(){
            console.log('Hubo un error');
        }

        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
        }
    }
})();