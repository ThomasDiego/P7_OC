<template>
  <div class="newP">
    <div class="newPost">
      <div class="line" style="width: 100%">
        <div class="userIcon">{{ user.username.charAt(0) }}</div>
        <input
          class="inputContent"
          type="text"
          v-model="content"
          placeholder="Quoi de neuf?"
        />
      </div>
      <div class="line">
        <div class="addImage">
          <input
            type="file"
            @change="onFileChange"
            accept="image/png, image/jpeg"
          />
        </div>
        <button class="buttonPublish" @click="post">Publier</button>
      </div>
    </div>
  </div>
</template>

<script>
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
import jwt_decode from "jwt-decode";
import axios from "axios";
export default {
  name: "NewPost",
  data() {
    return {
      image: "",
      content: "",
      user: [],
    };
  },
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
          process.env.VUE_APP_API_URL + "/api/posts/",
          {
            image: this.image,
            content: this.content,
          },
          {
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem("token").replaceAll('"', ""),
              "Content-Type": `multipart/form-data`,
            },
          }
        )
        .then((response) => {
          if (response.status === 201) {
            console.log(this.image);
            this.$router.push("/post/" + response.data.id);
          }
        })
        .catch((error) => {
          createToast(error.response.data.error, {
            type: "danger",
          });
          document
            .querySelector(".inputContent")
            .setAttribute("style", "border: 1px solid red");
        });
    },
    //new methods
    onFileChange(e) {
      this.image = e.target.files[0];
      createToast("Image uploaded !", {
        type: "success",
      });
      document.querySelector(".addImage").style =
        "filter: invert(45%) sepia(93%) saturate(641%) hue-rotate(80deg) brightness(106%) contrast(86%);";
    },
  },
  beforeMount() {
    this.getUserInfos();
  },
};
</script>

<style lang="scss" scoped>
.newPost {
  background-color: white;
  display: flex;
  flex-direction: row;
  padding: 20px;
  justify-content: space-between;
  border-bottom: 1px solid #e9e9e9;
  gap: 10px;

  .inputContent {
    background-color: #f3f3f3;
    border-radius: 20px;
    border: none;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 16px;
    flex: auto;
  }
  .inputContent:focus {
    border: 1px solid gray;
    outline: none;
  }

  .buttonPublish {
    height: 50px;
    width: 105px;
    font-size: 16px;
    border: none;
    background-color: #fd2d01;
    color: white;
    border-radius: 10px;
  }
  .buttonPublish:hover {
    opacity: 0.9;
    cursor: pointer;
  }

  .line {
    display: flex;
    flex-direction: row;
    gap: 15px;
    justify-content: right;
  }
  .addImage {
    position: relative;
    width: 30px;
    height: 30px;
    background-image: url("@/assets/addimg.svg");
    background-size: contain;
    background-repeat: no-repeat;
    align-self: center;
    filter: invert(71%) sepia(0%) saturate(1507%) hue-rotate(254deg)
      brightness(110%) contrast(95%);
  }
  .addImage:hover {
    cursor: pointer;
  }
  .addImage > input {
    opacity: 0;
    width: 30px;
    height: 30px;
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
  }
  .addImage > input:hover {
    cursor: pointer;
  }
}
@media only screen and (max-width: 660px) {
  .newPost {
    flex-direction: column;
  }
}
</style>
