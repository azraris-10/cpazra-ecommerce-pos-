<script setup>
import { state } from '../services/store'

function getIcon(type) {
  switch (type) {
    case 'success':
      return 'bi-check-circle-fill text-success'
    case 'danger':
      return 'bi-exclamation-triangle-fill text-danger'
    case 'warning':
      return 'bi-exclamation-circle-fill text-warning'
    default:
      return 'bi-info-circle-fill text-info'
  }
}
</script>

<template>
  <div v-if="state.toast.show" class="cp-toast">
    <div class="card border-0 shadow-lg rounded-3 overflow-hidden">
      <div class="card-body p-3 d-flex align-items-center gap-3 bg-white border-start border-4" :class="`border-${state.toast.type}`">
        <i :class="['bi fs-4', getIcon(state.toast.type)]"></i>
        <div class="flex-grow-1 text-dark fw-medium" style="font-size: 0.9rem;">
          {{ state.toast.message }}
        </div>
        <button
          type="button"
          class="btn-close btn-sm"
          aria-label="Close"
          @click="state.toast.show = false"
        ></button>
      </div>
    </div>
  </div>
</template>
