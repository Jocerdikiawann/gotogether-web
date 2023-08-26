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

<GoogleMap
  locationLat={$location.lat}
  locationLng={$location.lng}
  destinationLat={$destination.lat}
  destinationLng={$destination.lng}
  API_KEY={PUBLIC_MAPS_API_KEY}
  path={$polyline.polyline}
  rotationMarker={$rotation}
/>

<style>
</style>
