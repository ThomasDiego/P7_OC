<template>
  <div class="postComment">
    <div class="newLeft">
      <div class="left">
        <div class="userIcon">{{ user.username.charAt(0) }}</div>
      </div>
      <input
        class="middle"
        placeholder="Ecrire un commentaire ici..."
        type="text"
        v-model="content"
        maxlength="280"
      />
    </div>
    <button class="right" @click="post(id)">Commenter</button>
  </div>
</template>
<script>
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
import axios from "axios";
import jwt_decode from "jwt-decode";
export default {
  methods: {
    getUserInfos: function () {
      var decoded = jwt_decode(
        localStorage.getItem("token").replaceAll('"', "")
      );
      this.user = decoded;
    },
    post() {
      axios
        .post(
          process.env.VUE_APP_API_URL + "/api/posts/" + this.id + "/comment",
          {
            comment: this.content,
          },
          {
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem("token").replaceAll('"', ""),
            },
          }
        )
        .then((response) => {
          if (response.status === 201) {
            createToast("Commentaire ajouté", {
              type: "success",
            });
            this.content = "";
            this.$emit("callTest");
          }
        })
        .catch((error) => {
          createToast(error.response.data.error, {
            type: "danger",
          });
        });
    },
  },
  data() {
    return {
      content: "",
      user: [],
      id: this.$route.params.id,
    };
  },
  beforeMount() {
    this.getUserInfos();
  },
};
</script>
<style lang="scss" scoped>
.postComment {
  padding: 20px;
  display: flex;
  place-content: space-between;
  gap: 10px;
}
.middle {
  width: 100%;
  background-color: #f3f3f3;
  border-radius: 20px;
  border: none;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 16px;
  flex: auto;
  border: 1px solid transparent;
}
.middle:focus {
  outline: none !important;
  border: 1px solid #adadad;
}
.right {
  height: 50px;
  font-size: 16px;
  border: none;
  background-color: #fd2d01;
  color: white;
  border-radius: 10px;
  padding-left: 15px;
  padding-right: 15px;
  width: fit-content;
  margin-left: auto;
}
.right:hover {
  opacity: 0.9;
  cursor: pointer;
}
.newLeft {
  display: flex;
  width: 100%;
  gap: 10px;
}
@media only screen and (max-width: 660px) {
  .postComment {
    flex-direction: column;
  }
}
</style>