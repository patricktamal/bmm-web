<script lang="ts" setup>
import { NuxtIconName } from "#build/nuxt-icons";
import { RoutesNamedLocations } from "@typed-router";

withDefaults(
  defineProps<{
    type?: "page" | "playlist" | "private-playlist";
    title: string;
    link: RoutesNamedLocations;
    icon: NuxtIconName;
  }>(),
  {
    type: "page",
  }
);
</script>

<template>
  <NuxtLink
    :to="link"
    active-class="bg-tint dark:bg-tint-dark text-black-1 dark:text-black-1"
    class="group flex gap-2 rounded-xl px-4 py-2"
  >
    <NuxtIcon v-if="icon" :name="icon" class="text-xl" />
    <span
      class="transition-transform group-hover:translate-x-2"
      :class="{ 'font-semibold': type == 'page', 'text-lg': type == 'page' }"
    >
      {{ title }}
    </span>
  </NuxtLink>
</template>
