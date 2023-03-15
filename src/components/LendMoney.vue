<script setup lang="ts">
  import LendResults from "./LendResults.vue";
  import { reactive } from "vue";
  import axios from "axios";

  const moneyAmount = reactive({ 
	value: "", 
	setValue(val: string) {
	  this.value = val;
	}
  });

  const response = reactive({
	value: [] as any[],
	setValue(val: any) {
	  const keys = Object.keys(val);
	  const serializedData = keys.map((instituicao: string) => {
		const institutionProposals = val[instituicao]
		const updatedArrayInstPro = institutionProposals.map((el: any) => {
		  el["instituicao"] = instituicao;
		  return el;
		});
		return updatedArrayInstPro;
	  });

	  // @ts-ignore
	  this.value = serializedData.flat();
	}
  });

  const currencyPattern = (arr: any[]) => {
	let newArr = [];
	for (let i = 0; i < arr.length; i++) {
	  if (i === 2) {
		newArr.push(".");
	  } 
	  else if (i > 2 && ((i + 1) % 3) === 0) {
		newArr.push(",");
	  }
	  newArr.push(arr[i]);
	}
	return newArr;
  }
  
  const inputChangeHandler = (evnt: any) => {
	const { value } = evnt.target;
	const onlyNumbers = value.replace(/\D/g, "");
	const onlyNumbersRev = onlyNumbers.split("").reverse();
	let arr = currencyPattern(onlyNumbersRev);
	moneyAmount.setValue(arr.reverse().join(""));	
  };
  
  const requestHandler = async () => {
	const amountOfMoneyRequested = Number(moneyAmount.value.replace(/\D/g, ""));
	const payload = {
	  valor_emprestimo: amountOfMoneyRequested,
	  instituicoes: [],
	  convenios: [],
	  parcela: 0
	};
	
	const url = `http://127.0.0.1:8000/api/simular`;

	const res = await axios.post(url, payload);

	response.setValue(res.data);
  }
</script>

<template>
  <div class="box">
	<label>Valor do Emprestimo </label>
	<div class="input-section"> 
	  <p>R$</p> 
	  <input @keyup="inputChangeHandler" v-model="moneyAmount.value" class="input" placeholder=""/> 
	</div>
	<button @click="requestHandler" class="button" >Solicitar</button>
  </div>
  <div v-if="response.value.length">
	<h4>Resultados</h4>
	<div class="boxes-body">
	  <LendResults v-for="item in response.value" :valor_solicitado="moneyAmount.value" v-bind="item" />
	</div>
  </div>
</template>

<style>
  .box {
	border: 1px solid gray;
	border-radius: 10px;
	margin: 10px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: space-between;
	gap: 10px;
  }
  .input-section {
	color: #000;
	display: flex;
	background: #fff;
	padding: 5px 10px;
	gap: 10px;
	border-radius: 3px;
  }
  .input {
	border: none;
	border-radius: 3px;
	outline: none;
	direction: rtl;
  }
  .button {
	padding: 5px 15px;
	border: none;
	border-radius: 5px;
  }
  .boxes-body {
	display: flex;
	flex-direction: column;
	align-items: center;
	border: 1px solid gray;
	border-radius: 5px;
	height: 350px;
	overflow-y: scroll;
  }
</style>
