<template>
  <div>
    <HeaderComponent></HeaderComponent>
    <div class="container">
      <!-- for each posts -->
      <div class="post" v-for="post in posts" :key="post.id">
        <PostComponent :data="post"></PostComponent>
      </div>
      <!-- for each comments -->
      <PostCommentComponent @callTest="getAllComments"></PostCommentComponent>
      <div class="comment" v-for="comment in comments" :key="comment.id">
        <CommentComponent :data="comment"></CommentComponent>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import HeaderComponent from "../components/Header.vue";
import PostComponent from "../components/Post.vue";
import CommentComponent from "../components/Comment.vue";
import PostCommentComponent from "../components/NewComment.vue";
export default {
  components: {
    HeaderComponent,
    PostComponent,
    CommentComponent,
    PostCommentComponent,
  },
  methods: {
    getAllPosts: function () {
      axios
        .get(process.env.VUE_APP_API_URL + "/api/posts/" + this.id, {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem("token").replaceAll('"', ""),
          },
        })
        .then((response) => {
          if (response.status === 200) {
            this.posts[0] = response.data;
          } else {
            console.log("héhé");
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            localStorage.removeItem("token");
            this.$router.push("/?logout");
          }
          if (error.response.status === 404) {
            this.$el.querySelector(".postComment").innerHTML =
              "Post introuble ou a été supprimé";
          }
        });
    },
    getAllComments: function () {
      axios
        .get(
          process.env.VUE_APP_API_URL + "/api/posts/" + this.id + "/comments",
          {
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem("token").replaceAll('"', ""),
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            this.comments = response.data;
          } else {
            console.log("error");
          }
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
  },
  data() {
    return {
      id: this.$route.params.id,
      posts: [],
      comments: [],
    };
  },
  beforeMount() {
    this.getAllPosts();
    this.getAllComments();
  },
};
</script>

<style scoped>
</style>