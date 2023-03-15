<script setup lang="ts">
  import LendResults from "./LendResults.vue";
  import { reactive, onMounted } from "vue";
  import axios from "axios";
  import { API_URL } from "../main";


  const moneyAmount = reactive({ 
	value: "", 
	setValue(val: string) {
	  this.value = val;
	}
  });

  const institutions = reactive({ 
	value: [] as any[], 
	setValue(val: any[]) {
	  this.value = val.map(el => el.chave);
	}
  });

  const insurances = reactive({ 
	value: [] as any[], 
	setValue(val: any[]) {
	console.log(val);
	  this.value = val.map((el: any) => el.chave);
	}
  });

  const institutionSelected = reactive({ 
	value: "", 
	setValue(val: string) {
	  this.value = val;
	}
  });

  const insuranceSelected = reactive({ 
	value: "", 
	setValue(val: string) {
	console.log(val);
	  this.value = val;
	}
  });

  const quoteSelected = reactive({ 
	value: "", 
	setValue(val: string) {
	  this.value = val;
	}
  });

  onMounted(() => {
	Promise.all([
	  axios.get(`${API_URL}/instituicao`), 
	  axios.get(`${API_URL}/convenio`), 
	]).then((res: any) => {
	  const resInstitution = res[0];
	  const resInsurances = res[1];
	  institutions.setValue(resInstitution.data);
	  insurances.setValue(resInsurances.data);
	});
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
	},
	wasRequested: false,
	setWasRequested(val: boolean) {
	  this.wasRequested = val;
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

  const selectHandler = (setValue: (v: any) => void) => (evnt: any) => {
	setValue(evnt.target.value);	
  };
  
  const inputChangeHandler = (evnt: any) => {
	const { value } = evnt.target;
	const onlyNumbers = value.replace(/\D/g, "");
	const onlyNumbersRev = onlyNumbers.split("").reverse();
	let arr = currencyPattern(onlyNumbersRev);
	moneyAmount.setValue(arr.reverse().join(""));	
  };
  
  const requestHandler = async () => {
	const amountOfMoneyRequested = Number(moneyAmount.value.replace(/\D/g, ""));
	const institSlcted = institutionSelected.value;
	const insurSlcted = insuranceSelected.value;
	const payload = {
	  valor_emprestimo: amountOfMoneyRequested,
	  instituicoes: institSlcted ? [institSlcted] : [],
	  convenios: insurSlcted ? [insurSlcted] : [] ,
	  parcela: quoteSelected.value || 0
	};
	const url = `http://127.0.0.1:8000/api/simular`;

	const res = await axios.post(url, payload);

	response.setValue(res.data);
	response.setWasRequested(true);
  }
</script>

<template>
  <div class="box">
	<label>Valor do Empréstimo </label>
	<div class="input-section"> 
	  <p>R$</p> 
	  <input @keyup="inputChangeHandler" v-model="moneyAmount.value" class="input" placeholder=""/> 
	</div>
	<div class="input-section"> 
	  <select @change="selectHandler(institutionSelected.setValue)" v-model="institutionSelected.value" class="input">
		<option value="">selectione a instituição</option> 
		<option v-for="institution in institutions.value" :value="institution">{{ institution }}</option> 
	  </select>
	</div>
	<div class="input-section"> 
	  <select @change="selectHandler(insuranceSelected.setValue)" v-model="insuranceSelected.value" class="input">
		<option value="">Selecione o concênio</option> 
		<option v-for="insurance in insurances.value" :value="insurance">{{ insurance }}</option> 
	  </select>
	</div>
	<div class="input-section"> 
	  <select @change="selectHandler(quoteSelected.setValue)" v-model="quoteSelected.value" class="input">
		<option value="">Selecione o número de parcelas</option> 
		<option value="36">36</option> 
		<option value="48">48</option> 
		<option value="60">60</option> 
		<option value="72">72</option> 
		<option value="84">84</option> 
	  </select>
	</div>
	<button :disabled="!moneyAmount.value" @click="requestHandler" class="button" >Solicitar</button>
  </div>
	<div v-if="response.value.length">
	  <h4>Propostas</h4>
	  <div class="boxes-body">
		<LendResults v-for="item in response.value" :valor_solicitado="moneyAmount.value" v-bind="item" />
	  </div>
	</div>
	<h3 v-else-if="response.wasRequested" class="warning-message">Hoje não temos propostas interessantes para você neste momento :(</h3>
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
	cursor: pointer;
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
  .warning-message {
	color: #08d280;
  }
</style>
