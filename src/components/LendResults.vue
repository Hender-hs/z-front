<script setup lang="ts">
  defineProps<{
	instituicao: string;
	taxa: number;
	parcelas: number;
	valor_parcela: number;
	convenio: string;
	valor_solicitado: string
  }>();
</script>

<template>
	<div class="box result-card">
	  <div class="flex">
		<h5>Instituição: </h5> 
		  &nbsp;
		<h4>{{ instituicao }}</h4>
	  </div>
	  <h6>Valor Solicitado: R${{ valor_solicitado }} </h6>
	  <h6 class="contrast" >x{{ parcelas }} de R${{ valor_parcela }}</h6>
	  <h6>Juros de {{ taxa }}% a.a </h6>
	</div>
</template>

<style>
  .result-card {
	color: #fff;
	width: 200px;
	height: 150px;
	border-radius: 10px;
  }
  .contrast {
	color: green;
	font-weight: bolder;
	font-size: .8rem;
  }
  .flex {
	display: flex;
	align-items: flex-end;
  }
</style>
