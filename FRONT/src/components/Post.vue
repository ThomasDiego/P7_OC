<template>
  <div class="post">
    <div class="postHeader">
      <div class="postHeaderLeft">
        <div class="userIcon">{{ data.username.charAt(0) }}</div>
        <div class="postInfos">
          <div class="postUsername">{{ data.username }}</div>
          <router-link
            class="postDate linkZ"
            :to="{ path: '/post/' + data.id }"
          >
            {{ newTime }}
            <div v-if="data.modified === 1">(Modifié)</div>
          </router-link>
        </div>
      </div>
      <div
        class="postHeaderRight"
        v-if="data.by === user.userId || user.rank === 1"
      >
        <div class="buttonCustom" @click="goEdit(data.id)">
          <div class="buttonEdit"></div>
        </div>
        <div class="buttonCustom" @click="deletePost(data.id)">
          <div class="buttonDelete"></div>
        </div>
      </div>
    </div>
    <div class="postContent">{{ newContent }}</div>
    <router-link
      :to="{ path: '/post/' + data.id }"
      class="postImage"
      v-if="data.image !== ''"
    >
      <img :src="api + '/images/' + data.image" />
    </router-link>
    <div class="postStats">
      <router-link
        class="postStatsLeft linkZ"
        :to="{ path: '/post/' + data.id }"
      >
        <div class="postComIcon"></div>
        {{ data.comments }}
      </router-link>
      <div class="postStatsRight">
        <div
          @click="like('like', data.id)"
          v-if="liked === 0"
          class="postLikeIcon"
        ></div>
        <div
          @click="like('dislike', data.id)"
          v-else
          class="postLikeIcon postLikeIconLiked"
        ></div>
        <div v-if="data.liked === 0" class="countLike">
          {{ data.likes }}
        </div>
        <div v-else class="countLike likedRed">
          {{ data.likes }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import emoji from "to-emoji";
import axios from "axios";
import moment from "moment";
import "moment/locale/fr"; // without this line it didn't work
moment.locale("fr");
export default {
  name: "PostComponent",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newTime: "",
      liked: "",
      newContent: "",
      user: [],
      api: "",
    };
  },
  mounted() {
    this.newTime = moment(
      moment(this.data.date * 1000).format("YYYYMMDDkkmmss"),
      "YYYYMMDDkkmmss"
    ).fromNow();
    this.liked = this.data.liked;
    this.newContent = emoji.emoticonToEmoji(this.data.content);
  },
  beforeMount() {
    this.getUserInfos();
    this.api = process.env.VUE_APP_API_URL;
  },
  methods: {
    getUserInfos: function () {
      var decoded = jwt_decode(
        localStorage.getItem("token").replaceAll('"', "")
      );
      this.user = decoded;
    },
    goEdit(id) {
      this.$router.push({
        path: "/edit/" + id,
      });
    },
    deletePost(id) {
      var answer = window.confirm("Souhaitez-vous vraiment supprimer ce post?");
      if (answer) {
        axios
          .delete(process.env.VUE_APP_API_URL + "/api/posts/" + id, {
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem("token").replaceAll('"', ""),
            },
            data: {},
          })
          .then((response) => {
            if (response.status === 200) {
              this.$router.go(this.$router.currentRoute);
            } else {
              console.log("Error deleting post");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        //some code
      }
    },
    like(action, id) {
      axios
        .post(
          process.env.VUE_APP_API_URL + "/api/posts/" + id + "/" + action,
          {
            content: "",
          },
          {
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem("token").replaceAll('"', ""),
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            if (response.data.message === "1") {
              this.$el
                .querySelector(".postLikeIcon")
                .classList.add("postLikeIconLiked");
              this.$el.querySelector(".countLike").classList.add("likedRed");
              let count = parseInt(
                this.$el.querySelector(".countLike").innerText
              );
              count = count + 1;
              this.$el.querySelector(".countLike").classList.add("likedRed");
              this.$el.querySelector(".countLike").innerText = count;
              this.liked = 1;
            } else if (response.data.message === "0") {
              this.$el
                .querySelector(".postLikeIcon")
                .classList.remove("postLikeIconLiked");
              this.$el.querySelector(".countLike").classList.remove("likedRed");
              let count = parseInt(
                this.$el.querySelector(".countLike").innerText
              );
              count = count - 1;
              this.$el.querySelector(".countLike").classList.remove("likedRed");
              this.$el.querySelector(".countLike").innerText = count;
              this.liked = 0;
            } else {
              console.log(response.data.message);
            }
          } else {
            console.log("error");
          }
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.post {
  background-color: white;
  padding: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9e9e9;
}

.postHeader {
  display: flex;
  flex-direction: row;
  place-content: space-between;
}
.postHeaderLeft {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 20px;
}
.postHeaderRight {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}
.buttonCustom {
  height: 25px;
  width: 25px;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
}
.buttonEdit {
  width: 100%;
  height: 100%;
  background-image: url(@/assets/edit.svg);
  background-size: cover;
  background-size: 20px;
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: center;
  filter: invert(30%) sepia(6%) saturate(1944%) hue-rotate(195deg)
    brightness(95%) contrast(84%);
}
.buttonDelete {
  width: 100%;
  height: 100%;
  background-image: url(@/assets/delete.svg);
  background-size: cover;
  background-size: 20px;
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: center;
  filter: invert(28%) sepia(79%) saturate(5086%) hue-rotate(1deg)
    brightness(104%) contrast(108%);
}
.postInfos {
  align-self: center;
}

.postDate {
  color: #bcbcbc;
  display: flex;
  flex-direction: row;
  div {
    margin-left: 5px;
  }
}
.postContent {
  color: #4a4a4a;
  margin-bottom: 30px;
  word-wrap: break-word;
}
.postImage {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
}
.postImage > img {
  max-height: 400px;
  height: 100%;
  object-fit: cover;
  max-width: 100%;
}

.postStats {
  display: flex;
  flex-direction: row;
  place-content: space-evenly;
  color: #bcbcbc;
}
.postStatsRight {
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
}
.postLikeIcon {
  width: 25px;
  height: 25px;
  background-image: url(@/assets/star-regular.svg);
  filter: invert(79%) sepia(10%) saturate(4%) hue-rotate(338deg) brightness(94%)
    contrast(92%);
  background-repeat: no-repeat;
}
.postLikeIcon:hover {
  cursor: pointer;
}
.postLikeIconLiked {
  background-image: url(@/assets/star-solid.svg);
  filter: invert(61%) sepia(81%) saturate(588%) hue-rotate(8deg) brightness(96%)
    contrast(92%);
  animation: like 0.7s forwards;
}
@keyframes like {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.likedRed {
  color: #d4b50a;
}
.postStatsLeft {
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
}
.postComIcon {
  width: 25px;
  height: 25px;
  background-image: url(@/assets/com.svg);
  filter: invert(79%) sepia(10%) saturate(4%) hue-rotate(338deg) brightness(94%)
    contrast(92%);
  background-repeat: no-repeat;
}
.postComIcon:hover {
  cursor: pointer;
}
</style>
