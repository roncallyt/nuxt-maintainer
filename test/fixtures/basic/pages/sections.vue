<template>
  <NuxtMaintenance section="checkout">
    <div id="checkout-up">
      Checkout is available
    </div>
    <NuxtMaintenance section="inventory">
      <div id="inventory-up">
        Inventory is available
      </div>
      <template #fallback="{ message }">
        <div id="inventory-down">
          {{ message }}
        </div>
      </template>
    </NuxtMaintenance>
    <template #fallback="{ message }">
      <div id="checkout-down">
        {{ message }}
      </div>
    </template>
  </NuxtMaintenance>
  <NuxtMaintenance section="unknown">
    <div id="unknown-up">
      Unknown is available
    </div>
  </NuxtMaintenance>
</template>
