<template>
  <v-card>
    <v-carousel hide-delimiters height="240">
      <v-carousel-item v-for="i in 3" :key="i">
        <v-img :src="`https://picsum.photos/800/240?random=${i}`"></v-img>
      </v-carousel-item>
    </v-carousel>
  </v-card>
</template>

<script>
export default {
  name: 'Carousel'
};
</script>
