<template>
  <section class="util__container">
    <component v-if="story && story.content && story.content.component" :key="story.content._uid" :blok="story.content" :is="story.content.component"></component>
  </section>
</template>

<script>
import storyblokLivePreview from '@/mixins/storyblokLivePreview'

export default {
  data () {
    return {
      story: null
    }
  },
  mixins: [storyblokLivePreview],
  asyncData (context) {
    let path = '/' + context.route.params.pathMatch;
    return context.store.dispatch('loadPage', path).catch((e) => {
      context.error({ statusCode: e.response.status, message: e.response.statusText })
    });
  }
}
</script>
