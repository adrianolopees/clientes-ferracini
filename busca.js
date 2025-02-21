import { bancoDeDados } from "./firebase-config.js";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

class BuscarClientes {
  constructor() {
    this.campoBuscar = document.querySelector(".buscarCliente");
    this.resultados = document.querySelector(".resultadoDaBusca");
    this.clientesRef = collection(bancoDeDados, "clientes");
    this.modal = document.querySelector(".modal");

    this.eventos();
  }

  eventos() {
    // Evento de busca ao digitar
    this.campoBuscar.addEventListener("input", () => {
      this.buscarClientes();
    });
  }

  async buscarClientes() {
    const valorBuscado = this.campoBuscar.value.toLowerCase().trim();

    if (valorBuscado === "") {
      this.resultados.innerHTML = "";
      return;
    }

    try {
      // Buscando por referência
      const queryRef = query(
        this.clientesRef,
        where("referencia", "==", valorBuscado)
      );

      // Buscando por modelo
      const queryModelo = query(
        this.clientesRef,
        where("modelo", "==", valorBuscado)
      );

      // Executando as duas buscas em paralelo
      const [snapRef, snapModelo] = await Promise.all([
        getDocs(queryRef),
        getDocs(queryModelo),
      ]);

      // Combinando resultados únicos
      const clientesFiltrados = [];
      snapRef.forEach((doc) => {
        clientesFiltrados.push({ id: doc.id, ...doc.data() });
      });

      snapModelo.forEach((doc) => {
        // Evita duplicatas se o mesmo documento aparecer nas duas queries
        if (!clientesFiltrados.some((c) => c.id === doc.id)) {
          clientesFiltrados.push({ id: doc.id, ...doc.data() });
        }
      });

      this.exibirResultados(clientesFiltrados);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      this.resultados.innerHTML =
        "<p>Erro ao buscar clientes. Tente novamente.</p>";
    }
  }

  exibirResultados(clientes) {
    this.resultados.innerHTML = "";

    if (clientes.length === 0) {
      this.resultados.innerHTML = "<p>REF ou MODELO não encontrados!</p>";
      return;
    }

    clientes.forEach((cliente) => {
      const div = document.createElement("div");
      div.classList.add("cliente-item");

      div.innerHTML = `
        <strong>Cliente:</strong> ${cliente.cliente} <br>
        <strong>Celular:</strong> <span class="celular">${cliente.celular}</span><br>
        <strong>Modelo:</strong> ${cliente.modelo}<br>
        <strong>Referência:</strong> ${cliente.referencia}<br>
        <strong>Numeração:</strong> ${cliente.numeracao}<br>
        <strong>Cor:</strong> ${cliente.cor}
      `;

      this.criaIconZap(cliente, div);
      this.criaIconLixo(cliente, div);
      this.resultados.appendChild(div);
    });
  }

  criaIconZap(cliente, div) {
    const iconZap = document.createElement("i");
    iconZap.classList.add("fa-brands", "fa-whatsapp", "icon-zap");

    iconZap.addEventListener("click", () => {
      this.criaMsgZap(cliente);
    });

    const campoCelular = div.querySelector(".celular");
    campoCelular.insertAdjacentElement("afterend", iconZap);
  }

  criaMsgZap(cliente) {
    const mensagem = `Olá, ${cliente.cliente}! Aqui é da Ferracini maxi shopping, estou entrando em contato sobre o modelo ${cliente.modelo}, que não tinha no número ${cliente.numeracao} na cor ${cliente.cor} . Acabou de chegar, quer que separe pra você ?`;
    const celularSomenteNumeros = cliente.celular.replace(/\D/g, "");
    const urlWhatsApp = `https://wa.me/55${celularSomenteNumeros}?text=${encodeURIComponent(
      mensagem
    )}`;
    window.open(urlWhatsApp, "_blank");
  }

  criaIconLixo(cliente, div) {
    const iconLixo = document.createElement("i");
    iconLixo.classList.add("fa-regular", "fa-trash-can", "icon-lixo");

    iconLixo.addEventListener("click", () => {
      this.mostrarModal(cliente);
    });

    div.appendChild(iconLixo);
  }

  mostrarModal(cliente) {
    const modal = document.querySelector(".modal");
    const btnSIM = document.querySelector(".sim");
    const btnNAO = document.querySelector(".nao");

    modal.classList.add("ativo");

    // Recriando os botões para evitar múltiplos event listeners
    btnSIM.replaceWith(btnSIM.cloneNode(true));
    btnNAO.replaceWith(btnNAO.cloneNode(true));

    const novoBtnSIM = document.querySelector(".sim");
    const novoBtnNAO = document.querySelector(".nao");

    novoBtnSIM.addEventListener("click", async () => {
      try {
        await this.excluiCliente(cliente);
        alert(`Cliente ${cliente.cliente} excluído!`);
        modal.classList.remove("ativo");
        // Atualiza a busca para mostrar os resultados atualizados
        this.buscarClientes();
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
        alert("Erro ao excluir cliente. Tente novamente.");
      }
    });

    novoBtnNAO.addEventListener("click", () => {
      modal.classList.remove("ativo");
    });
  }

  async excluiCliente(cliente) {
    try {
      const clienteRef = doc(bancoDeDados, "clientes", cliente.id);
      await deleteDoc(clienteRef);
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      throw error;
    }
  }
}

const buscarClientes = new BuscarClientes();
