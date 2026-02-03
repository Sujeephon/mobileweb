<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo Gallery</ion-title>
        <div style="font-size: 0.85rem; opacity: 0.8;">
            โดย ศุจีภรณ์ ภูบาลชื่น 663380613-0
          </div>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Photo Gallery</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- CHANGE: Add a grid component to display the photos -->
      <ion-grid>
        <ion-row>
          <!-- CHANGE: Create a new column and image component for each photo -->
          <ion-col size="6" :key="photo.filepath" v-for="photo in photos">
            <ion-img :src="photo.webviewPath"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-fab slot="fixed" vertical="bottom" horizontal="center">
      <ion-fab-button @click="addNewToGallery">
      <ion-icon :icon="camera" />
    </ion-fab-button>
    </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { camera, trash, close } from 'ionicons/icons';
import {
  IonPage,
  IonHeader,
  IonFab,
  IonFabButton,
  IonIcon,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
} from '@ionic/vue';

import { usePhotoGallery } from '@/composables/usePhotoGallery';

// CHANGE: Add photos array to destructure from usePhotoGallery()
const { photos, addNewToGallery } = usePhotoGallery();
</script>