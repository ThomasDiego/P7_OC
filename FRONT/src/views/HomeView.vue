<template>
  <div>
    <HeaderComponent></HeaderComponent>
    <div class="container">
      <NewPost></NewPost>
      <!-- for each posts -->
      <div class="post" v-for="post in posts" :key="post.id">
        <PostComponent :data="post"></PostComponent>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import HeaderComponent from "../components/Header.vue";
import NewPost from "../components/NewPost.vue";
import PostComponent from "../components/Post.vue";
export default {
  components: {
    HeaderComponent,
    NewPost,
    PostComponent,
  },
  methods: {
    getAllPosts: function () {
      axios
        .get(process.env.VUE_APP_API_URL + "/api/posts/", {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem("token").replaceAll('"', ""),
          },
        })
        .then((response) => {
          if (response.status === 200) {
            this.posts = response.data;
          } else {
            console.log("error");
          }
        })
        .catch((error) => {
          console.log(error.response.data);
          //redirect to logout
          this.$router.push("/?logout");
        });
    },
  },
  beforeMount() {
    this.getAllPosts();
  },
  mounted() {
    document.title = "Home";
  },
  data() {
    return {
      posts: [],
    };
  },
};
</script>
