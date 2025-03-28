<script lang="ts" setup>
import { TrackModel } from "@bcc-code/bmm-sdk-fetch";
import { DropdownMenuItem } from "../DropdownMenu.vue";

const props = withDefaults(
  defineProps<{
    showSkeleton?: boolean;
    skeletonCount?: number;
    tracks: TrackModel[] | null;
  }>(),
  {
    skeletonCount: 5,
  }
);

const { t } = useI18n();

const { setQueue, addNext, addToQueue } = useNuxtApp().$mediaPlayer;
const showDropDownForTrack = ref<string | null>(null);

const isTrackTypeKnown = () => {
  const firstType = props.tracks?.[0]?.subtype;
  return (
    props.tracks?.every(
      (track: TrackModel) =>
        track.subtype === firstType ||
        (track.subtype === "song" && firstType === "singsong") ||
        (track.subtype === "singsong" && firstType === "song")
    ) || false
  );
};

const toggleDropdownForTrack = (trackReference: string) => {
  if (showDropDownForTrack.value === trackReference) {
    showDropDownForTrack.value = null;
  } else {
    showDropDownForTrack.value = trackReference;
  }
};

const dropdownMenuItemsForTrack = (track: TrackModel) => {
  const items: DropdownMenuItem[] = [];

  items.push({
    icon: "icon.play",
    text: t("track.dropdown.play-next"),
    clickFunction: () => addNext(track),
  });

  if (track?.meta?.parent?.id) {
    items.push({
      icon: "icon.category.album",
      text: t("track.dropdown.go-to-album"),
      link: { name: "album-id", params: { id: track.meta.parent.id } },
    });
  }

  items.push({
    icon: "icon.queue",
    text: t("track.dropdown.add-to-queue"),
    clickFunction: () => addToQueue(track),
  });
  items.push({
    icon: "icon.category.playlist",
    text: t("track.dropdown.add-to-playlist"),
    link: { name: "browse" }, // TODO: change link
  });
  items.push({
    icon: "icon.share",
    text: t("track.dropdown.share"),
    link: { name: "browse" }, // TODO: change link
  });
  items.push({
    icon: "icon.person",
    text: t("track.dropdown.go-to-contributors"),
    link: { name: "browse" }, // TODO: change link
  });
  items.push({
    icon: "icon.information",
    text: t("track.dropdown.more-info"),
    link: { name: "browse" }, // TODO: change link
  });

  return items;
};
</script>

<template>
  <ol class="w-full divide-y divide-label-separator">
    <template v-if="showSkeleton">
      <li
        v-for="skeleton in skeletonCount"
        :key="skeleton"
        class="my-6 h-11 w-full animate-pulse rounded-lg bg-background-2 dark:bg-background-dark-2"
      ></li>
    </template>
    <template v-else-if="tracks">
      <TrackItem
        v-for="(track, i) in tracks"
        :key="track.id"
        :track="track"
        :is-track-type-known="isTrackTypeKnown()"
        show-thumbnail
        @play-track="setQueue(tracks, i)"
        @open-options="toggleDropdownForTrack(`${track.id}-${i}`)"
      >
        <DropdownMenu
          v-if="showDropDownForTrack === `${track.id}-${i}`"
          :items="dropdownMenuItemsForTrack(track)"
          @close="toggleDropdownForTrack(`${track.id}-${i}`)"
        ></DropdownMenu>
      </TrackItem>
    </template>
  </ol>
</template>
