<script lang="ts">
  import { page } from "$app/stores";
  import {
    connectMqtt,
    destination,
    disconnectMqtt,
    getDestination,
    location,
    polyline,
    rotation,
    info,
  } from "../../stores";
  import GoogleMap from "../../components/GoogleMap.svelte";
  import { v4 as uuidv4 } from "uuid";
  import { onDestroy, onMount } from "svelte";
  import {
    PUBLIC_MAPS_API_KEY,
    PUBLIC_SERVER_URL,
    PUBLIC_BROKER_URL,
    PUBLIC_PASSWORD_BROKER,
    PUBLIC_USERNAME_BROKER,
  } from "$env/static/public";
  const { id } = $page.params;

  onMount(async () => {
    await getDestination(`${PUBLIC_SERVER_URL}/${id}`);

    await connectMqtt(
      {
        username: PUBLIC_USERNAME_BROKER,
        password: PUBLIC_PASSWORD_BROKER,
        clientId: uuidv4(),
      },
      PUBLIC_BROKER_URL,
      `topic/location/${id}`
    );
  });

  onDestroy(async () => {
    await disconnectMqtt();
  });
</script>

<svelte:head>
  <title>Sharing Location</title>
  <meta name="description" content="GoTogether" />
</svelte:head>

<div>
  <div
    class="p-2 flex flex-col items-center w-full border-gray-700 bg-gray-800 md:flex-row"
  >
    <img
      class="object-fit rounded-full w-16 h-16"
      src={`https://ui-avatars.com/api/?name=${$info.senderName}&background=0D8ABC&color=fff`}
      alt="profile"
    />
    <div class="flex flex-col justify-between p-4 leading-normal">
      <h5
        class="mb-2 text-1xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        {$info.senderName} meluncur ke {$info.destinationName}
      </h5>
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
        Estimasi {$info.estimateTime}
      </p>
    </div>
  </div>
  <GoogleMap
    locationLat={$location.lat}
    locationLng={$location.lng}
    destinationLat={$destination.lat}
    destinationLng={$destination.lng}
    API_KEY={PUBLIC_MAPS_API_KEY}
    path={$polyline.polyline}
    rotationMarker={$rotation}
  />
</div>

<style>
</style>
