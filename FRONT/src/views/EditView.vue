<template>
  <div>
    <HeaderComponent></HeaderComponent>
    <div class="container">
      <div class="modify">
        <h3>Modifier un post</h3>
        <p>Posté par {{ posts[0].username }}</p>
        <input
          class="content"
          type="text"
          name="content"
          v-model="content"
          placeholder="Contenu de votre post"
        />
        <div class="addImage">
          <input
            type="file"
            @change="onFileChange"
            accept="image/png, image/jpeg"
          />
        </div>
        <input
          class="button"
          @click="editPost(posts[0].id)"
          type="submit"
          value="Modifier"
        />
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import jwt_decode from "jwt-decode";
import HeaderComponent from "../components/Header.vue";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
export default {
  setup() {},
  components: {
    HeaderComponent,
  },
  methods: {
    getUserInfos: function () {
      var decoded = jwt_decode(
        localStorage.getItem("token").replaceAll('"', "")
      );
      this.user = decoded;
    },
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
            this.content = response.data.content;
            this.$el.querySelector(".content").value = this.posts[0].content;
            if (this.user.userId === this.posts[0].by || this.user.rank === 1) {
              this.$el.querySelector(".modify").style.display = "block";
            } else {
              this.$el.querySelector(".modify").innerHTML =
                "Tu n'as pas la permission de modifier ce post";
            }
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
          console.log(error.response.data);
        });
    },
    editPost(id) {
      axios
        .put(
          process.env.VUE_APP_API_URL + "/api/posts/" + id,
          {
            image: this.image,
            content: this.content,
          },
          {
            headers: {
              "content-type": "multipart/form-data",
              Authorization:
                "Bearer " + localStorage.getItem("token").replaceAll('"', ""),
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            createToast("Post modifié !", {
              type: "success",
            });
            this.$router.push("/post/" + id);
          }
        })
        .catch((error) => {
          createToast(error.response.data.error, {
            type: "danger",
          });
        });
    },
    onFileChange(e) {
      this.image = e.target.files[0];
    },
  },
  data() {
    return {
      id: this.$route.params.id,
      user: [],
      posts: [],
      image: "",
      content: "",
    };
  },
  beforeMount() {
    this.getUserInfos();
    this.getAllPosts();
  },
};
</script>
<style lang="scss" scoped>
.modify {
  display: block;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.content {
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}
.button {
  height: 50px;
  width: 105px;
  font-size: 16px;
  border: none;
  background-color: #4e5166;
  color: white;
  border-radius: 10px;
  cursor: pointer;
}
.addImage {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>