<script lang="ts">
  import { Loader } from "@googlemaps/js-api-loader";
  import { onMount } from "svelte";
  import { Easing, Tween } from "@tweenjs/tween.js";
  import type { LocationObject } from "../model";

  export let locationLat: number;
  export let locationLng: number;
  export let destinationLat: number;
  export let destinationLng: number;
  export let rotationMarker: number;
  export let path: string;
  export let API_KEY: string;

  let map: google.maps.Map;
  let markerLocation: google.maps.Marker;
  let markerDestination: google.maps.Marker;
  let polyline: google.maps.Polyline;
  let container: HTMLElement;

  let bounds: google.maps.LatLngBounds;

  const loader: Loader = new Loader({
    apiKey: API_KEY,
    version: "weekly",
    libraries: ["geometry"],
  });

  const startOptions: google.maps.CameraOptions = {
    heading: 0,
    zoom: 10,
  };

  const mapOptions: google.maps.MapOptions = {
    ...startOptions,
    mapId: "15431d2b469f209e",
    mapTypeId: "terrain",
  };

  async function initMap() {
    await loader
      .importLibrary("maps")
      .then(async ({ Map }) => {
        map = new Map(container, mapOptions);
        markerLocation = new google.maps.Marker({
          map,
          position: {
            lat: locationLat,
            lng: locationLng,
          },
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 4,
            fillColor: "#C70039",
            fillOpacity: 1,
            strokeColor: "#C70039",
          },
        });

        markerDestination = new google.maps.Marker({
          map,
          position: {
            lat: destinationLat,
            lng: destinationLng,
          },
        });

        polyline = new google.maps.Polyline({
          path: google.maps.geometry.encoding.decodePath(path),
          geodesic: true,
          strokeColor: "#000000",
          strokeOpacity: 1.0,
          strokeWeight: 3,
        });
        polyline.setMap(map);
        const point1 = markerLocation.getPosition();
        const point2 = markerDestination.getPosition();
        bounds = new google.maps.LatLngBounds();
        if (point1) {
          bounds.extend(point1);
        }
        if (point2) {
          bounds.extend(point2);
        }

        map.fitBounds(bounds);
        await animatedCamera(
          {
            zoom: 13,
            center: {
              lat: bounds.getCenter().lat(),
              lng: bounds.getCenter().lng(),
            },
          },
          5000
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function animatedCamera(
    target: google.maps.CameraOptions,
    duration: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const tween = new Tween(startOptions)
          .to(target, duration) // Pindah ke tujuan dalam 15 detik.
          .easing(Easing.Quadratic.Out) // Gunakan fungsi easing untuk membuat animasi lebih halus.
          .onUpdate((opt) => {
            map?.moveCamera(opt);
          })
          .start(); // Mulai animasi segera.
        function animate() {
          requestAnimationFrame(animate);
          tween.update();
        }
        resolve(animate());
      } catch (error) {
        reject(error);
      }
    });
  }

  function smoothMoveTo(newPosition: LocationObject) {
    const start = markerLocation.getPosition();
    const end = new google.maps.LatLng(newPosition.lat, newPosition.lng);
    const steps = 100; // Jumlah langkah animasi, sesuaikan sesuai keinginan.

    let stepNumber = 0;
    let intervalTime = 10; // Waktu antara setiap langkah animasi (dalam milidetik).
    let interval = setInterval(function () {
      stepNumber++;
      const fraction = stepNumber / steps;
      if (start) {
        const position = google.maps.geometry.spherical.interpolate(
          start,
          end,
          fraction
        );
        markerLocation.setPosition(position);
      }

      if (stepNumber >= steps) {
        clearInterval(interval);
      }
    }, intervalTime);
  }

  onMount(async () => {
    await initMap();
  });

  $: if (map) {
    smoothMoveTo({ lat: locationLat, lng: locationLng });
    markerLocation.setIcon({
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 4,
      fillColor: "#C70039",
      fillOpacity: 1,
      strokeColor: "#C70039",
      rotation: rotationMarker,
    });
  }
</script>

<div id="map" bind:this={container} />

<style>
  #map {
    width: 100vw;
    height: 100vh;
  }
</style>
