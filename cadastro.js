import { bancoDeDados } from "./firebase-config.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

class EsperandoProduto {
  constructor() {
    this.form = document.querySelector(".form");
    this.inputCelular = this.form.querySelector(".celular");
    this.clientesRef = collection(bancoDeDados, "clientes");

    this.aplicarMascaraCelular();
    this.eventos();
  }

  eventos() {
    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.tratandoEnvio(e);
    });

    const campos = document.querySelectorAll("input");

    campos.forEach((campo, index) => {
      campo.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          const proximoCampo = campos[index + 1];
          if (proximoCampo) {
            proximoCampo.focus();
          }
        }
      });
    });
  }

  async tratandoEnvio(e) {
    const dadosDoCliente = this.camposValidos();

    if (dadosDoCliente) {
      try {
        const docRef = await addDoc(this.clientesRef, {
          ...dadosDoCliente,
          referencia: dadosDoCliente.referencia.toLowerCase(),
          modelo: dadosDoCliente.modelo.toLowerCase(),
          dataCriacao: new Date().toISOString(),
        });
        console.log("Cliente salvo com ID:", docRef.id);
        alert("Cliente salvo com sucesso!");
        this.limparFormulario();
      } catch (error) {
        console.error("Erro ao salvar cliente:", error);
        alert("Erro ao salvar cliente. Tente novamente.");
      }
    }
  }

  limparFormulario() {
    this.form.reset();
  }

  aplicarMascaraCelular() {
    IMask(this.inputCelular, {
      mask: "(00) 00000-0000",
    });
  }

  camposValidos() {
    let valido = true;

    for (let msgErro of this.form.querySelectorAll(".msg-erro")) {
      msgErro.remove();
    }
    for (let input of this.form.querySelectorAll(".valido")) {
      input.classList.remove("input-erro");
    }

    const campos = this.form.querySelectorAll(".valido");
    campos.forEach((campo) => {
      const label = campo.previousElementSibling.innerText;

      if (!campo.value.trim()) {
        this.criaErro(campo, `${label} não pode estar em branco!`);
        valido = false;
      }

      if (
        campo.classList.contains("celular") &&
        campo.value.length < 15 &&
        campo.value.length > 0
      ) {
        this.criaErro(campo, "Número incompleto!");
        valido = false;
      }

      if (
        (campo.classList.contains("cor") ||
          campo.classList.contains("modelo")) &&
        campo.value.trim() !== "" &&
        !isNaN(campo.value)
      ) {
        this.criaErro(campo, `Somente letras!`);
        valido = false;
      }
    });

    if (valido) {
      return {
        cliente: this.form.querySelector(".cliente").value.trim(),
        celular: this.form.querySelector(".celular").value.trim(),
        modelo: this.form.querySelector(".modelo").value.trim(),
        referencia: this.form.querySelector(".referencia").value.trim(),
        numeracao: this.form.querySelector(".numero").value.trim(),
        cor: this.form.querySelector(".cor").value.trim(),
        dataCriacao: new Date(),
      };
    }
    return valido;
  }

  criaErro(campo, msg) {
    const div = document.createElement("div");
    div.innerText = msg;
    div.classList.add("msg-erro");

    const icon = document.createElement("span");
    icon.classList.add("bi", "bi-exclamation-triangle-fill");
    campo.classList.add("input-erro");

    div.insertAdjacentElement("afterbegin", icon);
    campo.insertAdjacentElement("afterend", div);
  }
}

const cliente1 = new EsperandoProduto();
