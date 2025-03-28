<script setup lang="ts">
import { NuxtIconName } from "#build/nuxt-icons";
import { ref, watchEffect } from "#imports";

const props = withDefaults(
  defineProps<{
    name: NuxtIconName;
    filled?: boolean;
  }>(),
  { filled: false }
);

const icon = ref<string | Record<string, any>>("");
let hasStroke = false;

async function getIcon() {
  try {
    const iconsImport = import.meta.glob("assets/icons/**/**.svg", {
      as: "raw",
      eager: false,
    });
    const rawIcon = await iconsImport[`/assets/icons/${props.name}.svg`]?.();
    if (rawIcon?.includes("stroke")) {
      hasStroke = true;
    }

    if (rawIcon) {
      icon.value = rawIcon;
    }
  } catch {
    throw new Error(
      `[nuxt-icons] Icon '${props.name}' doesn't exist in 'assets/icons'`
    );
  }
}

await getIcon();

watchEffect(getIcon);
</script>

<template>
  <span
    class="nuxt-icon"
    :class="{
      'nuxt-icon--fill': !filled,
      'nuxt-icon--stroke': hasStroke && !filled,
    }"
    v-html="icon"
  />
</template>

<style>
.nuxt-icon {
  display: flex;
  align-items: center;
}
.nuxt-icon svg {
  width: 1em;
  height: 1em;
  vertical-align: middle;
}
.nuxt-icon.nuxt-icon--fill,
.nuxt-icon.nuxt-icon--fill * {
  fill: currentColor !important;
}

.nuxt-icon.nuxt-icon--stroke,
.nuxt-icon.nuxt-icon--stroke * {
  stroke: currentColor !important;
}
</style>
