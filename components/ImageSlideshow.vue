<template>
  <div v-editable="blok" class="image-slideshow">
    <div v-if="blok.text" class="text">
      {{blok.text}}
    </div>
    <div v-swiper:swiper="swiperOption">
      <div class="swiper-wrapper">
        <div class="swiper-slide" :key="s._uid" v-for="s in blok.items" :style="{ 'background-image': 'url(' + $resizeImage(s.image, '700x0') + ')' }">
        </div>
      </div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['blok'],
  data() {
    return {
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 30,
        autoplay: {
          delay: 5000,
          disableOnInteraction: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/styles.scss';

.image-slideshow {
  color: $color-blue;
  .text {
    @include margin-page-middle();
    padding: 5rem 0 4rem;
    font-size: 1.8rem;
    font-family: $font-secondary;
    line-height: 1.4;
    letter-spacing: 1.4px;
  }
  .swiper-wrapper {
    margin: 0 -20px;
    padding: 0 30px;
  }
  // class via javascript
  .swiper-container {
    height: 50vh;
    .swiper-slide {
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }
    padding-bottom: 60px;
  }
  .swiper-button-prev,
  .swiper-button-next {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: $color-yellow;
    background-size: 12px;
  }
}
</style>
